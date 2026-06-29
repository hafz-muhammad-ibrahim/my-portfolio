#!/usr/bin/env bash
# run_all.sh — master E2E standards runner; writes reports/latest.json
set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_DIR="${SCRIPT_DIR}/reports"
mkdir -p "$REPORT_DIR"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHECKS=()
OVERALL="PASS"

if [[ -f "${SCRIPT_DIR}/config.env" ]]; then
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/config.env"
else
  echo "NOTE: Using config.env.example — copy to config.env and edit ports"
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/config.env.example"
fi

run_check() {
  local script="$1"
  local name
  name=$(basename "$script" .sh)
  echo ""
  echo "=== Running ${name} ==="
  local output rc=0
  output=$("$script" 2>&1) || rc=$?
  echo "$output"
  while IFS= read -r line; do
    [[ "$line" =~ ^(PASS|FAIL|SKIP|INFO)\| ]] || continue
    CHECKS+=("$line")
    [[ "$line" == FAIL* ]] && OVERALL="FAIL"
  done <<< "$output"
  [[ $rc -ne 0 ]] && OVERALL="FAIL"
}

run_check "${SCRIPT_DIR}/check_health.sh"
run_check "${SCRIPT_DIR}/check_metrics.sh"
run_check "${SCRIPT_DIR}/check_redis.sh"
# Uncomment for full unit test run:
# run_check "${SCRIPT_DIR}/run_go_tests.sh"

JSON_FILE="${REPORT_DIR}/latest.json"
{
  echo "{"
  echo "  \"timestamp\": \"${TIMESTAMP}\","
  echo "  \"overall\": \"${OVERALL}\","
  echo "  \"checks\": ["
  first=true
  for line in "${CHECKS[@]}"; do
    IFS='|' read -r status id detail extra <<< "$line"
    $first || echo ","
    first=false
    detail_esc=${detail//\"/\\\"}
    extra_esc=${extra//\"/\\\"}
    echo -n "    {\"status\": \"${status}\", \"id\": \"${id}\", \"detail\": \"${detail_esc}\", \"extra\": \"${extra_esc}\"}"
  done
  echo ""
  echo "  ]"
  echo "}"
} > "$JSON_FILE"

echo ""
echo "================================"
echo "Overall: ${OVERALL}"
echo "Report:  ${JSON_FILE}"
echo "================================"

[[ "$OVERALL" == "PASS" ]]
