#!/usr/bin/env bash
# run_go_tests.sh — unit tests for TA, DMS, TES
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "${SCRIPT_DIR}/config.env" 2>/dev/null || source "${SCRIPT_DIR}/config.env.example"

FAIL=0
run_tests() {
  local name="$1" repo="$2" pkg="${3:-./...}"
  if [[ ! -d "$repo" ]]; then
    echo "SKIP|qa_${name}|repo not found|${repo}"
    return 0
  fi
  echo "INFO|qa_${name}|running go test|${repo}"
  if (cd "$repo" && go test "$pkg" -count=1 -timeout 120s 2>&1); then
    echo "PASS|qa_${name}|go test ok|${pkg}"
  else
    echo "FAIL|qa_${name}|go test failed|${repo}"
    FAIL=1
  fi
}

# TA: arbitrage-realtime module inside trading-agent
if [[ -d "${TA_REPO}/arbitrage-realtime" ]]; then
  run_tests "ta" "${TA_REPO}/arbitrage-realtime" "./internal/calculator/... ./internal/orchestrator/..."
else
  echo "SKIP|qa_ta|arbitrage-realtime not found|${TA_REPO}"
fi

run_tests "dms" "${DMS_REPO}" "./internal/strategycore/... ./internal/transport/grpcopp/..."
run_tests "tes" "${TES_REPO}" "./..."

exit $FAIL
