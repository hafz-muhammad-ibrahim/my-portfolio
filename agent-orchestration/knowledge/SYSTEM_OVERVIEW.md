# System Overview — TA / DMS / TES

> Public summary. The trading services are private; this describes the shape of
> the system at the level needed to understand the orchestration layer, without
> configuration values, key schemas, venue names, or tuning thresholds.

## What this platform does

Real-time multi-exchange crypto arbitrage across several venues:

1. **TA** ingests market data over streaming connections
2. **TA** evaluates candidate opportunities in parallel each cycle
3. **DMS** puts each candidate through a series of decision gates
4. **DMS** orchestrates dual-leg execution via **TES**
5. **TES** places orders and streams fill events back to DMS

## Services

| Code | Name | Role |
|------|------|------|
| TA | Trading Agent | Market ingestion, opportunity detection |
| DMS | Decision Making Service | Gating, decisions, execution orchestration |
| TES | Trade Execution System | Venue adapters, order placement, fill tracking |

All three are Go services.

## Data flow

```text
Exchanges (streaming + REST)
       ↓
   TA: calculator + orchestrator
       ↓ gRPC candidate stream
   DMS: multi-gate evaluator → execution orchestrator
       ↓ HTTP
   TES: venue services → exchange APIs
       ↓ HTTP callback
   DMS: webhook merge → opportunity lifecycle state
```

## Shared infrastructure

| Component | Purpose |
|-----------|---------|
| **Redis** | Hot-path canonical state for in-flight opportunities and orders |
| **MongoDB** | Asynchronous long-term persistence |
| **Prometheus** | Metrics on DMS and TES |
| **Shared env file** | Venue and pair toggles shared across the three services |

## Strategy families

Same-exchange and cross-exchange spot arbitrage, plus futures-basis strategies.

## Performance characteristics

The system is latency-sensitive throughout. TA rejects stale quotes at the
ingestion boundary, DMS is budgeted to decide well inside a sub-second window,
and both gRPC paths use bounded queues with depth alerting so backpressure is
visible rather than silent. Concrete thresholds, queue sizes and latency
budgets live in the private repos' configuration.

## Agent orchestration boundary

| Layer | Technology | Role |
|-------|------------|------|
| **Trading hot path** | Go microservices | Execute trades (no LLM) |
| **Agent orchestration** | Python + Claude | Build, test, monitor, suggest fixes |

AI agents **never** place live orders. They run tests, read metrics, and
propose code changes on branches for human review.
