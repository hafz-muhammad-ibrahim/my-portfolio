# E2E Standards Checklist

Used by the **E2E Standards Agent** and `e2e-standards/run_all.sh`.

Each check returns `PASS` or `FAIL` with evidence. Scripts decide pass/fail; AI only explains failures.

---

## 1. Service health

| ID | Check | How |
|----|-------|-----|
| `health_dms` | DMS `GET /health` returns 200 | `check_health.sh` |
| `health_tes` | TES `GET /health` returns 200 | `check_health.sh` |
| `health_ta` | TA process running (optional) | manual / systemd |

---

## 2. Pairs & candidates (TA)

| ID | Check | How |
|----|-------|-----|
| `pairs_exchanges` | All configured exchanges in `EXCHANGES` connected | logs / Redis |
| `pairs_calc_slots` | 45 parallel calc slots run without panic | unit tests `calculator` |
| `pairs_candidates_emit` | gRPC OppCandidate stream active when `TA_EMIT_OPP_CANDIDATE=true` | metrics / logs |
| `pairs_freshness` | Stale quotes (>500ms) rejected | `freshness.go` tests |

---

## 3. Filters (DMS)

| ID | Check | How |
|----|-------|-----|
| `filter_readiness` | Readiness gate blocks stale/missing data | `DMS_READINESS_GATE_ENABLED` |
| `filter_margin` | Margin preflight blocks insufficient balance | `DMS_MARGIN_PREFLIGHT_ENABLED` |
| `filter_reject_no_tes` | REJECT decisions never call TES | integration tests |
| `filter_profit` | Profit gate configured (may be disabled in test) | `strategycore/evaluator.go` |

---

## 4. Execution path

| ID | Check | How |
|----|-------|-----|
| `exec_approve_triggers_tes` | APPROVE → HTTP to TES with `opportunity_id` + `request_id` | logs / Redis `tde:req` |
| `exec_callback` | TES → DMS `POST /api/v1/order/status` within 5s | TES outbox metrics |
| `exec_dual_leg` | Both legs tracked in `tde:opp` | e2e lifecycle tests |

---

## 5. Performance

| ID | Check | Threshold |
|----|-------|-----------|
| `perf_dms_decision` | Decision latency p95 | < 100ms (under normal load) |
| `perf_ta_cycle` | Orchestrator cycle warning | < 100ms |
| `perf_grpc_queue_ta` | TA candidate queue depth | < 80% of 1024 |
| `perf_grpc_queue_dms` | DMS `DMSPostDecideQueueDepth` | < 80% of 512 |

---

## 6. Lifecycle

| ID | Check | How |
|----|-------|-----|
| `life_close` | `POST /api/v1/close` completes opportunity | DMS close service |
| `life_revert_60s` | Failed dual-leg reverts within ~60s | `trade_lifecycle.go` / CAT tests |
| `life_no_stuck_opp` | No `tde:opp:*` stuck > 5 min in active state | `check_redis.sh` |
| `life_recovery` | TES B4 startup sync completes | TES `/metrics` startup gauges |

---

## 7. Data integrity

| ID | Check | How |
|----|-------|-----|
| `data_redis_mongo` | Redis ↔ Mongo sync integrity | `e2e_redis_mongo_integrity` |
| `data_lifecycle` | Full opp lifecycle rules | `e2e_lifecycle_integrity` |
| `data_schema` | Keys match `DMS_REDIS_TDE_SCHEMA.md` | schema validation |

---

## Report format

`e2e-standards/reports/latest.json`:

```json
{
  "timestamp": "2026-06-22T12:00:00Z",
  "overall": "PASS",
  "checks": [
    {"id": "health_dms", "status": "PASS"},
    {"id": "health_tes", "status": "PASS"}
  ]
}
```

### `overall` states

| State | Meaning | `run_offline.sh` exit code |
|-------|---------|---------------------------|
| `PASS` | Every check ran and passed | 0 |
| `FAIL` | At least one check ran and failed | 1 |
| `INCOMPLETE` | No check failed, but at least one was `SKIP`ped and never ran | 2 |

`INCOMPLETE` is **not** a pass. A skipped check is an absence of evidence — most
often a repo path in `config.env` that does not resolve — so a run that skipped
anything may not be reported as green.

PM agent reads this file when `overall` is `FAIL` or `INCOMPLETE`.
