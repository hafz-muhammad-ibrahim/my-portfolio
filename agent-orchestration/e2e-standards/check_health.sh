#!/usr/bin/env bash
# check_health.sh — DMS and TES /health endpoints
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "${SCRIPT_DIR}/config.env" 2>/dev/null || source "${SCRIPT_DIR}/config.env.example"

check_url() {
  local name="$1" url="$2"
  local code body
  code=$(curl -s -o /tmp/health_body.txt -w "%{http_code}" --max-time "${METRICS_TIMEOUT_SEC:-5}" "$url" || echo "000")
  body=$(cat /tmp/health_body.txt 2>/dev/null || echo "")
  if [[ "$code" == "200" ]]; then
    echo "PASS|health_$(echo "$name" | tr '[:upper:]' '[:lower:]')|HTTP $code|${body:0:120}"
    return 0
  fi
  echo "FAIL|health_$(echo "$name" | tr '[:upper:]' '[:lower:]')|HTTP $code|${url}"
  return 1
}

FAIL=0
check_url "dms" "${DMS_URL}/health" || FAIL=1
check_url "tes" "${TES_URL}/health" || FAIL=1
exit $FAIL
