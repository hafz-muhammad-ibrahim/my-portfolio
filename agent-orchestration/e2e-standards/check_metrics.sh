#!/usr/bin/env bash
# check_metrics.sh — scrape DMS/TES Prometheus metrics for queue depth
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# NB: `source missing || source fallback` is fatal under `set -e` in bash 3.2,
# so test for the file first (same guard run_all.sh and run_offline.sh use).
if [[ -f "${SCRIPT_DIR}/config.env" ]]; then
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/config.env"
else
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/config.env.example"
fi

# Metric names are deployment-specific. Set DMS_QUEUE_METRIC and
# TES_OUTBOX_METRIC in config.env (untracked) to enable these checks; without
# them each check reports SKIP rather than guessing a metric name.
DMS_QUEUE_METRIC="${DMS_QUEUE_METRIC:-}"
TES_OUTBOX_METRIC="${TES_OUTBOX_METRIC:-}"

scrape_metric() {
  local url="$1" pattern="$2"
  curl -s --max-time "${METRICS_TIMEOUT_SEC:-5}" "${url}/metrics" 2>/dev/null | grep -E "^${pattern}" | head -1 || true
}

FAIL=0

# DMS post-decide queue depth
if [[ -z "$DMS_QUEUE_METRIC" ]]; then
  echo "SKIP|perf_grpc_queue_dms|DMS_QUEUE_METRIC not set in config.env|"
else
  DMS_LINE=$(scrape_metric "${DMS_URL}" "$DMS_QUEUE_METRIC")
  if [[ -n "$DMS_LINE" ]]; then
    DMS_VAL=$(echo "$DMS_LINE" | awk '{print $2}' | cut -d. -f1)
    if [[ "${DMS_VAL:-0}" -lt "${DMS_QUEUE_WARN:-410}" ]]; then
      echo "PASS|perf_grpc_queue_dms|depth=${DMS_VAL}|threshold=${DMS_QUEUE_WARN:-410}"
    else
      echo "FAIL|perf_grpc_queue_dms|depth=${DMS_VAL}|threshold=${DMS_QUEUE_WARN:-410}"
      FAIL=1
    fi
  else
    echo "SKIP|perf_grpc_queue_dms|metric not found (is DMS running?)|"
  fi
fi

# TES callback outbox (informational)
if [[ -z "$TES_OUTBOX_METRIC" ]]; then
  echo "SKIP|exec_callback|TES_OUTBOX_METRIC not set in config.env|"
else
  TES_LINE=$(scrape_metric "${TES_URL}" "$TES_OUTBOX_METRIC")
  if [[ -n "$TES_LINE" ]]; then
    echo "PASS|exec_callback|tes metrics reachable|${TES_LINE:0:80}"
  else
    echo "SKIP|exec_callback|TES metrics not scraped|"
  fi
fi

exit $FAIL
