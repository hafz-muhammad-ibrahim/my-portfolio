# Muhammad Ibrahim — Portfolio

**Senior Full-Stack Engineer** · Production Go microservices · AI-accelerated development workflows

## Highlights

| Area | Evidence |
|------|----------|
| **Full-stack / platform** | 3-service arbitrage platform (TA, DMS, TES) — 1,400+ commits, gRPC, Redis, 5 exchanges |
| **AI-augmented delivery** | Cursor-driven dev workflow, offline E2E standards suite, PM→Dev→QA agent loop (portfolio) |
| **Scale** | 100K+ DAU platform work (Aylab), cost optimization, ML fraud detection |

## Repositories (private — available on request)

| Service | GitHub | Role |
|---------|--------|------|
| **TA** — Trading Agent | [trading-agent](https://github.com/hafz-muhammad-ibrahim/trading-agent) | Real-time market ingestion & opportunity detection |
| **DMS** — Decision Making Service | [decision-making-service](https://github.com/hafz-muhammad-ibrahim/decision-making-service) | 6-gate decisions & execution orchestration |
| **TES** — Trade Execution System | [trade-execution-system](https://github.com/hafz-muhammad-ibrahim/trade-execution-system) | Multi-exchange order placement & fill tracking |

## Agent orchestration layer (this repo)

Learning & portfolio project: multi-role agent workflow on top of the trading codebase.

- **Knowledge base** — system docs for AI context (RAG-ready)
- **E2E standards** — `run_offline.sh` — 8 automated checks (no live exchanges)
- **Agent prompts** — PM, Dev, Reviewer, QA, E2E roles
- **Cursor workflow** — [CURSOR_STEP3_PROMPT.md](./agent-orchestration/CURSOR_STEP3_PROMPT.md)

```text
You → PM (Cursor) → Dev (Cursor) → QA/E2E (run_offline.sh) → PASS
```

Start here: [agent-orchestration/NEXT_STEPS.md](./agent-orchestration/NEXT_STEPS.md)

## Architecture

```
TA (ingestion) ──gRPC──► DMS (decide) ──HTTP──► TES (execute)
         │                      │                      │
         └──────────── Redis tde:* lifecycle ──────────┘
```

## Local paths (development)

```text
~/desktop/trading-agent/              # TA (arbitrage-realtime inside)
~/Desktop/decision-making-service/    # DMS
~/Desktop/trade-execution-system/     # TES
~/Desktop/my-portfolio/               # Portfolio + agent orchestration
```
