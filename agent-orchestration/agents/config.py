"""Shared paths and settings for agent orchestration."""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_AGENTS_DIR = Path(__file__).resolve().parent
_ORCH_DIR = _AGENTS_DIR.parent

load_dotenv(_AGENTS_DIR / ".env")


def _path(env_key: str, default: Path) -> Path:
    raw = os.getenv(env_key, "").strip()
    return Path(raw).expanduser().resolve() if raw else default.resolve()


PORTFOLIO_PATH = _path("PORTFOLIO_PATH", _ORCH_DIR.parent)
ORCHESTRATION_PATH = _ORCH_DIR

E2E_STANDARDS_PATH = _path("E2E_STANDARDS_PATH", ORCHESTRATION_PATH / "e2e-standards")
KNOWLEDGE_PATH = ORCHESTRATION_PATH / "knowledge"
PROMPTS_PATH = ORCHESTRATION_PATH / "prompts"
RAG_DB_PATH = _AGENTS_DIR / "chroma_db"

TA_REPO_PATH = _path("TA_REPO_PATH", Path.home() / "desktop/trading-agent")
DMS_REPO_PATH = _path("DMS_REPO_PATH", Path.home() / "Desktop/decision-making-service")
TES_REPO_PATH = _path("TES_REPO_PATH", Path.home() / "Desktop/trade-execution-system")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
MAX_AGENT_ITERATIONS = int(os.getenv("MAX_AGENT_ITERATIONS", "5"))
