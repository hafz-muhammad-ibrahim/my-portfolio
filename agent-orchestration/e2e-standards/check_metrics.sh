#!/usr/bin/env bash
# check_metrics.sh — scrape DMS/TES Prometheus metrics for queue depth
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "${SCRIPT_DIR}/config.env" 2>/dev/null || source "${SCRIPT_DIR}/config.env.example"

scrape_metric() {
  local url="$1" pattern="$2"
  curl -s --max-time "${METRICS_TIMEOUT_SEC:-5}" "${url}/metrics" 2>/dev/null | grep -E "^${pattern}" | head -1 || true
}

FAIL=0

# DMS post-decide queue (gauge name from pkg/metrics)
DMS_LINE=$(scrape_metric "${DMS_URL}" "dms_post_decide_queue_depth")
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

# TES callback outbox (informational)
TES_LINE=$(scrape_metric "${TES_URL}" "tes_dms_callback_outbox")
if [[ -n "$TES_LINE" ]]; then
  echo "PASS|exec_callback|tes metrics reachable|${TES_LINE:0:80}"
else
  echo "SKIP|exec_callback|TES metrics not scraped|"
fi

exit $FAIL
