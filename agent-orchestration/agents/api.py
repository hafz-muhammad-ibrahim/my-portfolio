"""FastAPI webhook for n8n integration (Phase 4)."""
from __future__ import annotations

import json
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from orchestrator import pm_plan_from_e2e, run_e2e_standards

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
    report = run_e2e_standards()
    plan = pm_plan_from_e2e(report)
    return {"report": report, "plan": plan, "message": req.message}


@app.post("/api/incident")
def handle_incident(payload: IncidentPayload) -> dict[str, Any]:
    report = payload.model_dump()
    plan = pm_plan_from_e2e(report)
    return {"plan": plan}
