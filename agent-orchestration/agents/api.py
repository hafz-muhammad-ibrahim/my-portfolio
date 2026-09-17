"""FastAPI webhook for n8n integration (Phase 4)."""
from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from orchestrator import pm_plan_claude, pm_plan_stub, run_offline_e2e

app = FastAPI(title="Trading Platform Agent Orchestrator", version="0.1.0")


class RunRequest(BaseModel):
    message: str = "Run E2E standards"


class IncidentPayload(BaseModel):
    overall: str = "FAIL"
    checks: list[dict[str, Any]] = []


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "agent-orchestrator"}


@app.post("/api/run")
def run_workflow(req: RunRequest) -> dict[str, Any]:
    """n8n Workflow 3: feature request → run the offline suite, then plan.

    pm_plan_claude falls back to a deterministic stub when ANTHROPIC_API_KEY is
    unset, so this endpoint responds with or without a key.
    """
    report = run_offline_e2e()
    plan = pm_plan_claude(req.message, report)
    return {"report": report, "plan": plan, "message": req.message}


@app.post("/api/incident")
def handle_incident(payload: IncidentPayload) -> dict[str, Any]:
    """n8n Workflow 2: a FAIL/INCOMPLETE report arrives → deterministic triage.

    Uses the stub planner: no API key, no network call, no LLM in the alert path.
    """
    report = payload.model_dump()
    plan = pm_plan_stub(report)
    return {"plan": plan}
