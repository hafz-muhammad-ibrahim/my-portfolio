# Learning Mode — Agentic AI Without Live Trading

You **do not need** exchange accounts, Redis, MongoDB, or running TA/DMS/TES to learn agentic AI with this project.

## Two layers (don't mix them)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER A — Trading code (TA/DMS/TES)                        │
│  Go repos on disk · 1,400+ commits · you are NOT running it │
└─────────────────────────────────────────────────────────────┘
                              ↑
                    agents READ and EDIT code
                              ↑
┌─────────────────────────────────────────────────────────────┐
│  LAYER B — Agent team (what you are building)               │
│  PM → Dev → Review → QA → E2E → loop                        │
│  Validates with: go test (offline) + your instructions        │
└─────────────────────────────────────────────────────────────┘
```

**Agents work on code and tests — not on live markets.**

---

## What each agent checks WITHOUT live exchanges

| Your requirement | Offline equivalent |
|------------------|-------------------|
| All pairs triggering | `go test ./internal/calculator/...` |
| Filters working | `go test ./internal/strategycore/...` |
| Latency / queues | `go test -run Load` in grpc packages |
| Revert / close lifecycle | lifecycle unit tests + e2e test code (when Redis optional) |
| E2E standards | `./run_offline.sh` |

---

## How to talk to PM agent (learning flow)

```
YOU:  "Add a log line when readiness gate rejects stale price"
        ↓
PM:   Breaks into tasks → assigns dev_dms
        ↓
DEV:  Edits evaluator.go on branch agent/feature-xyz
        ↓
REVIEWER: Checks diff → APPROVE or REJECT
        ↓
QA:   go test ./internal/strategycore/...
        ↓
E2E:  ./run_offline.sh
        ↓
PASS → you review and merge
FAIL → PM gets report → assigns fix → loop again
```

---

## One command to start (offline)

```bash
cd ~/Desktop/my-portfolio/agent-orchestration/e2e-standards
chmod +x run_offline.sh
./run_offline.sh
```

Then:

```bash
cd ~/Desktop/my-portfolio/agent-orchestration/agents
source .venv/bin/activate   # after setup
python orchestrator.py --offline "Check all standards"
```

---

## Tools you need

| Tool | Required? | Purpose |
|------|-----------|---------|
| Go | Yes | Run tests on existing code |
| Python 3 | Yes | Orchestrator |
| Claude or OpenAI API key | Yes (for PM/Dev AI) | Agent brains |
| Cursor | Recommended | Dev agent UI (you approve edits) |
| n8n | Optional | Schedule offline test runs |
| Exchange accounts | **NO** | Not needed for learning |
| Redis/Mongo running | **NO** | Not needed for unit tests |

---

## Realistic expectation

| Expectation | Reality |
|-------------|---------|
| "100% working feature from one PM message" | AI + tests get you **close**; **you** approve merge |
| "System trades profitably" | Not required for learning agentic workflows |
| "Learn agentic AI on real codebase" | **Yes** — this is the right approach |

---

## Next file to read

`agents/LEARNING_GUIDE.md` — step-by-step setup for full PM loop.
