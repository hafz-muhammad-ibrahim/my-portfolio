# Agent Orchestration — Portfolio Layer

AI agent team that **builds, tests, and monitors** the TA / DMS / TES trading platform.

> **Important:** AI agents work on **development & ops** — not inside the live trade execution hot path.

## Folder structure

```text
agent-orchestration/
├── NEXT_STEPS.md          ← Start here (phased roadmap)
├── knowledge/             ← RAG docs (agents read these first)
├── e2e-standards/         ← Deterministic pass/fail scripts
├── prompts/               ← System prompts per agent role
├── n8n/                   ← Workflow automation setup
└── agents/                ← Python orchestrator (Phase 4)
```

## The 7 agents

| Agent | Job |
|-------|-----|
| **PM** | Receives feature/bug → breaks into tasks → assigns workers |
| **Dev (TA)** | Changes `trading-agent/arbitrage-realtime` |
| **Dev (DMS)** | Changes `decision-making-service` |
| **Dev (TES)** | Changes `trade-execution-system` |
| **Reviewer** | Approves or rejects code diffs |
| **QA** | Runs `go test` across services |
| **E2E Standards** | Runs `e2e-standards/run_all.sh` |

## Loop

```
You or n8n trigger
    → PM plans tasks
    → Dev implements on git branch
    → Reviewer checks diff
    → QA runs unit tests
    → E2E runs standards checklist
    → PASS: notify you for merge
    → FAIL: PM replans → loop
```

## Quick start (today)

```bash
# 1. Copy config
cp agent-orchestration/e2e-standards/config.env.example \
   agent-orchestration/e2e-standards/config.env

# 2. Edit URLs/ports if your stack differs
# 3. Run standards (services must be up)
cd agent-orchestration/e2e-standards
./run_all.sh
```

## Status

| Phase | Status |
|-------|--------|
| 0 — Portfolio docs | ✅ Done (this repo) |
| 1 — Knowledge base | ✅ Done |
| 2 — E2E standards scripts | ✅ Done |
| 3 — n8n monitoring | 📋 Your turn (see `n8n/README.md`) |
| 4 — Python agents + API | 📋 Next |
| 5 — Full loop | 📋 After Phase 4 |
| 6 — Portfolio website + demo video | 📋 Final |
