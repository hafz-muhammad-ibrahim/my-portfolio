# E2E Standards Checklist

Used by the **E2E Standards Agent** and the `e2e-standards/` runners.

Each check returns `PASS` or `FAIL` with evidence. Scripts decide pass/fail; AI only explains failures.

> Public summary. Check IDs are functional — the runners emit them and the PM
> agent routes on them, so they are listed verbatim. Concrete thresholds,
> metric names, key patterns and source paths are deployment-specific and live
> in the private repos and in untracked local config.

---

## 1. Service health

| ID | Check | How |
|----|-------|-----|
| `health_dms` | DMS health endpoint returns 200 | `check_health.sh` |
| `health_tes` | TES health endpoint returns 200 | `check_health.sh` |
| `health_ta` | TA process running (optional) | manual / service manager |

---

## 2. Pairs & candidates (TA)

| ID | Check | How |
|----|-------|-----|
| `pairs_exchanges` | All configured venues connected | logs / Redis |
| `pairs_calc_slots` | Parallel calculation slots run without panic | calculator unit tests |
| `pairs_candidates_emit` | gRPC candidate stream active when emission is enabled | metrics / logs |
| `pairs_freshness` | Stale quotes rejected at the freshness threshold | market package tests |

---

## 3. Filters (DMS)

| ID | Check | How |
|----|-------|-----|
| `filter_readiness` | Readiness gate blocks stale or missing data | gate toggle + unit tests |
| `filter_margin` | Margin preflight blocks insufficient balance | gate toggle + unit tests |
| `filter_reject_no_tes` | REJECT decisions never call TES | integration tests |
| `filter_profit` | Profit gate configured (may be disabled in test) | strategycore tests |

---

## 4. Execution path

| ID | Check | How |
|----|-------|-----|
| `exec_approve_triggers_tes` | APPROVE issues an HTTP call to TES carrying correlation ids | logs / Redis |
| `exec_callback` | TES reports order status back to DMS within the callback budget | TES outbox metrics |
| `exec_dual_leg` | Both legs tracked in the opportunity record | e2e lifecycle tests |

---

## 5. Performance

| ID | Check | Threshold |
|----|-------|-----------|
| `perf_dms_decision` | Decision latency p95 | within the configured budget |
| `perf_ta_cycle` | Orchestrator cycle warning | within the configured budget |
| `perf_grpc_queue_ta` | TA candidate queue depth | below the configured warn level |
| `perf_grpc_queue_dms` | DMS post-decide queue depth | below the configured warn level |

Warn levels come from `TA_QUEUE_WARN` / `DMS_QUEUE_WARN` in
`e2e-standards/config.env`; metric names come from `DMS_QUEUE_METRIC` /
`TES_OUTBOX_METRIC` in the same file.

---

## 6. Lifecycle

| ID | Check | How |
|----|-------|-----|
| `life_close` | Close request completes an opportunity | DMS close service |
| `life_revert_60s` | Failed dual-leg reverts inside the revert budget | lifecycle tests |
| `life_no_stuck_opp` | No opportunity stuck in an active state past its budget | `check_redis.sh` |
| `life_recovery` | TES startup sync completes | TES startup gauges |

`check_redis.sh` scans the pattern given by `OPP_KEY_PATTERN` in
`e2e-standards/config.env`, and skips when it is unset.

---

## 7. Data integrity

| ID | Check | How |
|----|-------|-----|
| `data_redis_mongo` | Redis ↔ Mongo sync integrity | integrity test suite |
| `data_lifecycle` | Full opportunity lifecycle rules | lifecycle test suite |
| `data_schema` | Keys match the documented Redis schema | schema validation |

---

## Report format

`e2e-standards/reports/latest.json`:

```json
{
  "timestamp": "2026-06-22T12:00:00Z",
  "overall": "PASS",
  "checks": [
    {"status": "PASS", "id": "health_dms"},
    {"status": "PASS", "id": "health_tes"}
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
