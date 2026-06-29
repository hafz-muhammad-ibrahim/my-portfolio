# Learning Guide — Full PM Agent Loop (No Live Trading)

Step-by-step to get: **you tell PM → agents do the work → tests pass**.

---

## Step 1 — Install once (30 min)

```bash
# Go (you already have it)
go version

# Python orchestrator
cd ~/Desktop/my-portfolio/agent-orchestration/agents
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here   # get from console.anthropic.com

TA_REPO_PATH=/Users/qbatch/desktop/trading-agent
DMS_REPO_PATH=/Users/qbatch/Desktop/decision-making-service
TES_REPO_PATH=/Users/qbatch/Desktop/trade-execution-system
```

Get API key: https://console.anthropic.com (~$5 free credit to start)

---

## Step 2 — Verify offline tests work (5 min)

```bash
cd ~/Desktop/my-portfolio/agent-orchestration/e2e-standards
./run_offline.sh
```

Expected: mostly `PASS`. If any `FAIL`, fix Go path in `config.env`.

**No exchange accounts. No docker. No live services.**

---

## Step 3 — Run orchestrator (learning mode)

```bash
cd ~/Desktop/my-portfolio/agent-orchestration/agents
source .venv/bin/activate

# Check standards + get PM task plan
python orchestrator.py --offline

# Give PM a feature request
python orchestrator.py --request "Add debug logging when DMS readiness gate rejects"
```

---

## Step 4 — How the 7 agents work in practice

### Today (learning setup — hybrid)

| Agent | Who does it now | Tool |
|-------|-----------------|------|
| **PM** | `orchestrator.py` + Claude API | Python |
| **Dev (TA/DMS/TES)** | **You in Cursor** with PM's task list | Cursor + Claude |
| **Reviewer** | Cursor Agent or `orchestrator.py --review` | Claude |
| **QA** | `run_go_tests.sh` or `run_offline.sh` | Shell (automatic) |
| **E2E** | `run_offline.sh` | Shell (automatic) |

**Why hybrid?** Fully autonomous Dev agents writing code need file-edit tools + API ($). Cursor IS your Dev agent while you learn. PM + QA + E2E are automated.

### Flow you follow manually (until Phase 5 full auto)

1. Run: `python orchestrator.py --request "YOUR FEATURE"`
2. PM outputs JSON task list
3. Open Cursor → paste PM task → let Cursor edit files
4. Run: `./run_offline.sh`
5. If FAIL → paste report back to PM → repeat

### Later (full auto)

`orchestrator.py` calls Claude with file tools → Dev edits code directly → loop without Cursor.

---

## Step 5 — Example session

**You say:**
> Add a comment above readiness gate check explaining the 500ms threshold

**PM outputs:**
```json
{
  "tasks": [
    {"agent": "dev_dms", "files": ["internal/strategycore/decision/evaluator.go"], ...},
    {"agent": "qa", "description": "go test ./internal/strategycore/..."},
    {"agent": "e2e", "description": "./run_offline.sh"}
  ]
}
```

**You in Cursor:**
> @evaluator.go PM task: add comment above readiness gate about 500ms threshold

**You run:**
```bash
./run_offline.sh   # must PASS
```

**Done.** You learned: PM → Dev → QA → E2E without running trading.

---

## Step 6 — Optional n8n (schedule offline checks)

Even without live trading, n8n can run every hour:

```bash
npm install -g n8n && n8n start
```

Workflow: Cron → Execute `run_offline.sh` → Email if FAIL

See `n8n/README.md`.

---

## Step 7 — Portfolio story

> Built multi-agent development workflow on a production Go microservices codebase (1,400+ commits) — PM orchestration, automated QA/E2E via offline test suite, human-in-the-loop merge gates. Learned agentic AI without live trading infrastructure.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `go test` path not found | Fix `TA_REPO`, `DMS_REPO`, `TES_REPO` in config.env |
| API key error | Set `ANTHROPIC_API_KEY` in agents/.env |
| Tests slow first run | Go downloads modules once |
| Want full auto Dev | Ask to implement Phase 5 in orchestrator.py |
