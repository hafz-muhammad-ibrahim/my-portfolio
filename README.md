# Muhammad Ibrahim

**Senior full-stack engineer — Node.js/React/TypeScript, plus Python for AI agents & automation**

[GitHub](https://github.com/hafz-muhammad-ibrahim) · [LinkedIn](https://linkedin.com/in/muhammadibrahim-7504211b9)

Previously: platform engineering on a 100K+ DAU product.

---

# Agent Orchestration for a Go Trading Platform

An AI agent-orchestration layer built on top of a private three-service Go
arbitrage platform (TA → DMS → TES). It pairs an LLM tool-use agent — which can
run the test suite and read the project's knowledge base on its own initiative —
with a deterministic offline verification suite that decides PASS/FAIL without
any model involvement. The design boundary is deliberate and enforced in the
code: **no LLM sits in the trade execution hot path.** Models read metrics, run
tests, explain failures, and propose plans; the Go services place the orders.
This repository contains the orchestration layer only — the trading services are
private and linked below.

---

## Architecture

```text
                   ┌──────────────────────────────────────┐
   CLI / HTTP ────► │  Agent (raw Anthropic tool loop)      │
                   │  agents/raw_tool_agent.py             │
                   └───────────────┬──────────────────────┘
                                   │ model chooses a tool
                   ┌───────────────▼──────────────────────┐
                   │  Tool registry (3 tools)              │
                   │  agents/tools/registry.py             │
                   └───┬───────────────────────┬──────────┘
                       │                       │
        run_offline_tests                read_knowledge_doc
                       │                 list_knowledge_docs
                       ▼                       ▼
   ┌───────────────────────────┐   ┌──────────────────────────┐
   │ Verification suite        │   │ Knowledge base           │
   │ e2e-standards/            │   │ knowledge/*.md           │
   │ run_offline.sh → JSON     │   │ (path-traversal guarded) │
   └───────────┬───────────────┘   └──────────────────────────┘
               │ go test
               ▼
   ┌───────────────────────────────────────────┐
   │ Private Go repos — TA / DMS / TES         │
   │ not in this repository                    │
   └───────────────────────────────────────────┘

   HTTP surface — agents/api.py (FastAPI)
     GET  /health         liveness
     POST /api/run        run suite → LLM planner  (feature path)
     POST /api/incident   report in → stub planner (alerting path)
```

**Components**

- **Agent** — a hand-written Anthropic tool-calling loop (no framework). The
  model decides when to call a tool; results are fed back until it returns a
  final answer.
- **Tools** — three: run the offline suite, read a knowledge doc, list knowledge
  docs. Tool errors are returned to the model as JSON rather than raised, so it
  can recover.
- **Knowledge base** — `SYSTEM_OVERVIEW.md`, `STANDARDS_CHECKLIST.md`,
  `LEARNING_MODE.md`. The reader rejects path traversal and absolute paths.
- **Verification suite** — `run_offline.sh` shells out to `go test` across the
  three services and emits a JSON report. The script decides PASS/FAIL; the
  model only explains the result.
- **HTTP surface** — FastAPI app exposing the loop to automation.
- **Role prompts** — `prompts/` holds system prompts for PM, Dev, Reviewer, QA
  and E2E roles, with JSON output contracts.

---

## What actually runs vs. what needs the private repos

Stated plainly, because it matters for anyone evaluating this in a few minutes.

**Runs standalone, no private repos, no API key:**

- `uvicorn api:app` — boots clean; `/health` and `/api/incident` both serve.
- `POST /api/incident` — deterministic triage of a report into a task list.
- The tool loop's wiring (`raw_tool_agent.py --dry-run`).
- Knowledge-base tools.

**Runs standalone, needs `ANTHROPIC_API_KEY`:**

- `raw_tool_agent.py "<question>"` — the live tool-calling loop.
- `POST /api/run` — falls back to a deterministic stub plan when no key is set,
  so the endpoint still responds.

**Needs the private Go repos checked out locally:**

- The six verification checks, which run `go test` against TA, DMS and TES.

Without those repos the suite reports **`INCOMPLETE`** (exit code 2) and names
each check it skipped. **This is by design, not a failure.** An earlier version
treated a skipped check as a pass, which meant a machine with no repos checked
out reported a clean bill of health having run zero tests. A skipped check is an
absence of evidence, so the suite now refuses to call it green:

| `overall` | Meaning | Exit |
|---|---|---|
| `PASS` | Every check ran and passed | 0 |
| `FAIL` | At least one check ran and failed | 1 |
| `INCOMPLETE` | Nothing failed, but at least one check never ran | 2 |

The six checks: `pairs_calc_slots`, `pairs_orchestrator`, `pairs_freshness`,
`filter_readiness`, `exec_tes`, `life_lifecycle_unit`.

---

## Quickstart

Requires Python 3.11+. Go 1.24+ only if you have the private repos.

```bash
git clone <this-repo> && cd my-portfolio/agent-orchestration/agents

python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # optional: add ANTHROPIC_API_KEY for LLM planning
uvicorn api:app --port 8000
```

Then:

```bash
curl localhost:8000/health

# deterministic triage — no API key needed
curl -X POST localhost:8000/api/incident \
  -H 'Content-Type: application/json' \
  -d '{"overall":"FAIL","checks":[
        {"status":"FAIL","id":"filter_readiness","detail":"go test failed"},
        {"status":"SKIP","id":"exec_tes","detail":"repo not found"}]}'

# runs the suite, then plans (synchronous — takes as long as `go test` does)
curl -X POST localhost:8000/api/run \
  -H 'Content-Type: application/json' \
  -d '{"message":"Add debug logging when the DMS readiness gate rejects"}'
```

`/api/incident` returns one task per failed check routed to the owning service,
plus one per skipped check flagged for a human.

To point the suite at the Go repos, set `TA_REPO` / `DMS_REPO` / `TES_REPO` in
`e2e-standards/config.env`.

---

## Design decisions

**The script decides; the model explains.** PASS/FAIL comes from `go test` exit
codes, never from a model. The LLM reads the resulting JSON and explains what
broke and what to do about it, but cannot overturn a verdict. This keeps the
verification signal reproducible and cheap, and keeps model non-determinism out
of the part that has to be trusted.

**Different planner per path, chosen by blast radius.**

- `/api/incident` is the **alerting** path, fired when a report comes back
  failing. It uses the deterministic stub planner: no API key, no network call.
  An LLM round-trip does not belong between a failure and its alert — that adds
  a dependency and a latency spike exactly when the system is already unhealthy.
- `/api/run` is the **feature-request** path, where the posted message really is
  a human request that benefits from interpretation. It uses the LLM planner,
  which degrades to the stub when no key is configured.

**No LLM in the trade hot path.** Agents operate on development and ops —
running tests, reading metrics, proposing diffs on branches. They never place
orders. A human merges.

**A skipped check is not a pass.** See the state table above.

---

## Repository layout

```text
agent-orchestration/
├── agents/
│   ├── api.py                 FastAPI surface
│   ├── raw_tool_agent.py      Anthropic tool-calling loop
│   ├── orchestrator.py        PM planners + CLI
│   ├── config.py              paths anchored on __file__, env-sourced secrets
│   └── tools/                 tool schemas, dispatch, implementations
├── e2e-standards/             verification scripts + JSON reports
├── knowledge/                 docs the agent reads as context
└── prompts/                   per-role system prompts
```

---

## Not implemented

Listed so nothing above reads as a bigger claim than it is:

- **n8n workflows** — `n8n/README.md` documents three intended workflows; none
  are built.
- **RAG** — `chromadb` is installed and a DB path is declared, but no retrieval
  is wired. The agent reads knowledge docs directly by filename.
- **Autonomous Dev/Reviewer agents** — `prompts/` defines these roles, but only
  the tool-loop agent and the two planners execute. Code edits are human-driven.
- **Most of `STANDARDS_CHECKLIST.md`** — that document describes a broader
  target suite, including online checks against running services. Six offline
  checks are implemented today.

---

## The trading platform (private)

| Service | Role |
|---|---|
| **TA** — Trading Agent | Real-time multi-exchange market ingestion and opportunity detection |
| **DMS** — Decision Making Service | Gated decisions and execution orchestration |
| **TES** — Trade Execution System | Order placement and fill tracking |

```text
TA (ingestion) ──gRPC──► DMS (decide) ──HTTP──► TES (execute)
        │                     │                      │
        └─────────── Redis lifecycle state ──────────┘
```

Source is private; read access available on request.
