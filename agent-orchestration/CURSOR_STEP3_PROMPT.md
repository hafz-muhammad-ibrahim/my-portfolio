# Step 3 — Single Cursor Prompt (PM + Dev + QA)

Copy everything inside the box below into **Cursor Chat** (one message).
No Anthropic API key needed.

---

## COPY FROM HERE ↓

```
You are running the full agent workflow for my trading platform portfolio.

## Your roles (do all in order)

### 1. PM AGENT
Read context:
- @my-portfolio/agent-orchestration/knowledge/SYSTEM_OVERVIEW.md
- @my-portfolio/agent-orchestration/knowledge/STANDARDS_CHECKLIST.md

User request: Add a code comment above the DMS readiness gate explaining the 500ms price freshness threshold (ReadinessMaxPriceAgeMs / maxPriceDataAge). Do NOT change any logic.

Output a short PM plan:
- agent: dev_dms
- files to edit
- acceptance: run_offline.sh still PASS

### 2. DEV AGENT (implement now)
Edit:
- @decision-making-service/internal/strategycore/decision/readiness.go
- @decision-making-service/internal/strategycore/decision/evaluator.go

Add clear comments only:
- Why readiness rejects stale prices
- That default fast-path uses 500ms when DMS_READINESS_MAX_PRICE_AGE_MS is set (aligned with TA quote freshness)
- No logic changes

### 3. REVIEWER AGENT
Confirm: comments only, no behavior change, tests should still pass.

### 4. QA / E2E (tell me the command)
Remind me to run:
cd ~/Desktop/my-portfolio/agent-orchestration/e2e-standards && ./run_offline.sh

Done when Overall: PASS.
```

## COPY TO HERE ↑

---

## After Cursor finishes

Run in Terminal:

```bash
cd ~/Desktop/my-portfolio/agent-orchestration/e2e-standards
./run_offline.sh
```

Expected: `Overall: PASS`

---

## Next feature (change the request line)

Replace the "User request:" line with anything small, e.g.:

- Add debug log when readiness gate rejects
- Add README section on gRPC OppCandidate flow
- Add test for stale price rejection at 501ms

Same prompt structure — only change the request.
