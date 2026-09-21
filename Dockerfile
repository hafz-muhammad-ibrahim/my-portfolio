# Agent orchestration API — production image.
#
# Build:  docker build -t agent-orchestrator .
# Run:    docker run -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant-... agent-orchestrator
#
# No secret is baked in. ANTHROPIC_API_KEY must be supplied at runtime; without
# it the service still responds, falling back to the deterministic stub planner.

FROM python:3.11-slim

# PYTHONDONTWRITEBYTECODE: no .pyc in the image layer
# PYTHONUNBUFFERED:       logs reach the cloud host's collector immediately
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Demo mode is the default *for the image*: a cloud host has no private Go
# repos, so /api/run serves the bundled, clearly-labelled sample report instead
# of shelling out to `go test`. Override at runtime with -e DEMO_MODE=false.
ENV DEMO_MODE=true \
    PORT=8000

WORKDIR /app

# Dependencies first, so the layer caches across source changes.
COPY agent-orchestration/agents/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# The application reads knowledge/ and prompts/ through paths anchored on
# config.py's __file__, so the on-disk layout must mirror the repository:
# agents/ sits beside knowledge/, prompts/ and e2e-standards/.
COPY agent-orchestration/agents/      ./agents/
COPY agent-orchestration/knowledge/   ./knowledge/
COPY agent-orchestration/prompts/     ./prompts/
COPY agent-orchestration/e2e-standards/ ./e2e-standards/

# Run as an unprivileged user owning only what it needs.
RUN useradd --create-home --shell /usr/sbin/nologin --uid 10001 appuser \
    && chown -R appuser:appuser /app
USER appuser

WORKDIR /app/agents

EXPOSE 8000

# python:3.11-slim ships no curl, and installing one purely to health-check
# would grow the image; urllib is already present.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os,sys,urllib.request; \
url='http://127.0.0.1:'+os.environ.get('PORT','8000')+'/health'; \
sys.exit(0 if urllib.request.urlopen(url, timeout=4).status == 200 else 1)"

# Shell form so $PORT expands at runtime — cloud hosts inject their own.
CMD ["sh", "-c", "exec uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]
