# System Overview — TA / DMS / TES

## What this platform does

Real-time **multi-exchange crypto arbitrage**:

1. **TA** watches prices on 5 exchanges via WebSocket
2. **TA** calculates profitable opportunities (45 parallel slots per cycle)
3. **DMS** evaluates each opportunity through decision gates
4. **DMS** orchestrates dual-leg execution via **TES**
5. **TES** places orders and streams fill events back to DMS

## Services

| Code | Name | Language | Default port |
|------|------|----------|--------------|
| TA | Trading Agent (`arbitrage-realtime`) | Go 1.24 | process (no HTTP health) |
| DMS | Decision Making Service | Go 1.23 | 8080 |
| TES | Trade Execution System | Go 1.25 | 8080 (use `TRADE_EXECUTION_SYSTEM_PORT`) |

## Data flow

```
Exchanges (WS/REST)
       ↓
   TA: calculator + orchestrator
       ↓ gRPC OppCandidate stream
   DMS: 6-gate evaluator → execution orchestrator
       ↓ HTTP POST /api/v1/{exchange}/...
   TES: venue services → exchange APIs
       ↓ HTTP POST /api/v1/order/status
   DMS: webhook merge → Redis tde:opp lifecycle
```

## Shared infrastructure

| Component | Purpose |
|-----------|---------|
| **Redis** | Hot-path canonical JSON (`tde:opp`, `tde:order:*`, `tde:req:*`) |
| **MongoDB** | Async long-term persistence |
| **Prometheus** | Metrics on DMS and TES (`/metrics`) |
| **SHARED_ENV_FILE** | `EXCHANGES` and pair toggles shared across TA/DMS/TES |

## Exchanges (5)

Binance, Kraken, Bybit, Gate.io, OKX — spot and futures.

## Strategy types (TA calculator)

- `same_exchange`
- `cross_exchange`
- `futures_basis`
- `usdc_futures_basis`

## Performance targets (design SLOs)

| Metric | Target |
|--------|--------|
| TA orchestrator cycle warning | 80–100ms (`ARB_TARGET_LATENCY_MS`) |
| TA quote freshness gate | < 500ms |
| DMS decision latency | < 100ms |
| gRPC candidate load test | 350 streams/sec |
| TA emitter queue | default 1024 |
| DMS post-decide queue | default 512, workers 20 |

## Agent orchestration boundary

| Layer | Technology | Role |
|-------|------------|------|
| **Trading hot path** | Go microservices | Execute trades (no LLM) |
| **Agent orchestration** | n8n + Python + Claude | Build, test, monitor, suggest fixes |

AI agents **never** place live orders. They run tests, read metrics, and propose code changes on branches.

## Repo locations (local)

```text
/Users/qbatch/desktop/trading-agent/           # TA
/Users/qbatch/Desktop/decision-making-service/ # DMS
/Users/qbatch/Desktop/trade-execution-system/  # TES
```

## GitHub (private)

```text
github.com/hafz-muhammad-ibrahim/trading-agent
github.com/hafz-muhammad-ibrahim/decision-making-service
github.com/hafz-muhammad-ibrahim/trade-execution-system
```
