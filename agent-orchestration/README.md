# Agent Orchestration — implementation

The orchestration layer for the TA / DMS / TES trading platform.

> **The [root README](../README.md) is the source of truth** for what this is,
> how it fits together, what runs standalone, and how to start it. This file
> only covers layout and the pieces that live in this directory.

**Boundary:** agents work on development and ops — running tests, reading
metrics, proposing changes. No LLM sits in the live trade execution hot path.

## Folder structure

```text
agent-orchestration/
├── agents/            Python: tool-loop agent, planners, FastAPI surface
├── e2e-standards/     deterministic pass/fail scripts + JSON reports
├── knowledge/         markdown docs the agent reads as context
├── prompts/           per-role system prompts (see note below)
└── n8n/               intended workflow automation — documented, not built
```

## What executes

| Component | Where |
|---|---|
| **Tool-loop agent** — model decides when to call a tool | `agents/raw_tool_agent.py` |
| **LLM planner** — turns a feature request into a task list | `agents/orchestrator.py` (`pm_plan_claude`) |
| **Stub planner** — deterministic triage of a failing report | `agents/orchestrator.py` (`pm_plan_stub`) |
| **Verification suite** — `go test` across the three services | `e2e-standards/run_offline.sh` |
| **HTTP surface** — `/health`, `/api/run`, `/api/incident` | `agents/api.py` |

`prompts/` defines system prompts for five roles — PM, Dev, Reviewer, QA and
E2E. These are design artifacts describing the intended division of labour.
Only the components in the table above run today; code edits are human-driven,
so there is no autonomous Dev or Reviewer agent. The root README's
"Not implemented" section lists the rest of the gaps.

## Two verification suites

| Script | Needs | Writes |
|---|---|---|
| `run_offline.sh` | the private Go repos on disk | `reports/latest_offline.json`, copied to `latest.json` |
| `run_all.sh` | DMS, TES and Redis actually running | `reports/latest.json` |

`run_offline.sh` is the one wired into the agent and the HTTP surface. It
reports `PASS` / `FAIL` / `INCOMPLETE` (exit 0 / 1 / 2); a skipped check yields
`INCOMPLETE` and never `PASS`. Both scripts write `latest.json`, so treat that
file as belonging to whichever ran most recently.

## Running it

See **Quickstart** in the [root README](../README.md). Repo paths and service
URLs come from `e2e-standards/config.env` (copy `config.env.example`).
