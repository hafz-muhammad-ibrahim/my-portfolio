"""FastAPI webhook for n8n integration (Phase 4)."""
from __future__ import annotations

import json
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from config import DEMO_MODE, DEMO_REPORT_PATH
from orchestrator import pm_plan_claude, pm_plan_stub, run_offline_e2e

app = FastAPI(title="Trading Platform Agent Orchestrator", version="0.1.0")


class RunRequest(BaseModel):
    message: str = "Run E2E standards"


class IncidentPayload(BaseModel):
    overall: str = "FAIL"
    checks: list[dict[str, Any]] = []


def _demo_report() -> dict[str, Any]:
    """Bundled sample report, used only when DEMO_MODE is on.

    Runs no tests and reads no private repository. The report is labelled
    demo/sample at every level so nothing can mistake it for a real run.
    """
    try:
        report = json.loads(DEMO_REPORT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return {
            "demo": True,
            "mode": "demo",
            "overall": "INCOMPLETE",
            "note": "Demo report could not be loaded.",
            "error": str(exc),
            "checks": [],
        }
    report["demo"] = True
    return report


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "service": "agent-orchestrator",
        "description": (
            "Agent orchestration layer for a private Go trading platform. "
            "A deterministic verification suite decides pass/fail; the model "
            "explains results and plans work. No LLM runs in the trade hot path."
        ),
        "demo_mode": DEMO_MODE,
        "demo_note": (
            "DEMO_MODE is on: /api/run returns a bundled sample report and runs "
            "no tests against the private repositories."
            if DEMO_MODE
            else "DEMO_MODE is off: /api/run executes the real offline suite."
        ),
        "endpoints": {
            "GET /": "this description",
            "GET /health": "liveness",
            "POST /api/run": "run the suite (or return the sample report in demo mode), then plan",
            "POST /api/incident": "post a report, get deterministic triage (no API key needed)",
            "GET /docs": "OpenAPI UI",
        },
        "source": "https://github.com/hafz-muhammad-ibrahim/my-portfolio",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "agent-orchestrator"}


@app.post("/api/run")
def run_workflow(req: RunRequest) -> dict[str, Any]:
    """n8n Workflow 3: feature request → run the offline suite, then plan.

    pm_plan_claude falls back to a deterministic stub when ANTHROPIC_API_KEY is
    unset, so this endpoint responds with or without a key. When DEMO_MODE is
    on the report is the bundled sample instead of a real run; the planner is
    the same either way.
    """
    report = _demo_report() if DEMO_MODE else run_offline_e2e()
    plan = pm_plan_claude(req.message, report)
    return {"report": report, "plan": plan, "message": req.message, "demo": DEMO_MODE}


@app.post("/api/incident")
def handle_incident(payload: IncidentPayload) -> dict[str, Any]:
    """n8n Workflow 2: a FAIL/INCOMPLETE report arrives → deterministic triage.

    Uses the stub planner: no API key, no network call, no LLM in the alert path.
    """
    report = payload.model_dump()
    plan = pm_plan_stub(report)
    return {"plan": plan}
