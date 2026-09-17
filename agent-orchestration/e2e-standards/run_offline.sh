#!/usr/bin/env bash
# run_offline.sh — Learning mode: NO live services, NO exchange accounts required.
# Validates code quality via go test only.
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
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/config.env.example"
fi

# Overall state precedence: FAIL > INCOMPLETE > PASS.
# A SKIP means a check never ran, so the suite cannot claim PASS.
record() {
  CHECKS+=("$1")
  case "$1" in
    FAIL*) OVERALL="FAIL" ;;
    SKIP*) [[ "$OVERALL" == "PASS" ]] && OVERALL="INCOMPLETE" ;;
  esac
  return 0
}

run_go_test() {
  local id="$1" repo="$2" pkg="$3"
  shift 3
  local extra_args=()
  [[ $# -gt 0 ]] && extra_args=("$@")
  if [[ ! -d "$repo" ]]; then
    record "SKIP|${id}|repo not found|${repo}"
    return 0
  fi
  if [[ ${#extra_args[@]} -gt 0 ]]; then
    echo "=== ${id}: go test ${pkg} ${extra_args[*]} ==="
    if (cd "$repo" && go test "$pkg" -count=1 -timeout 120s "${extra_args[@]}" >/tmp/go_test_out.txt 2>&1); then
      record "PASS|${id}|go test ok|${pkg}"
    else
      tail -5 /tmp/go_test_out.txt >&2
      record "FAIL|${id}|go test failed|${pkg}"
    fi
  else
    echo "=== ${id}: go test ${pkg} ==="
    if (cd "$repo" && go test "$pkg" -count=1 -timeout 120s >/tmp/go_test_out.txt 2>&1); then
      record "PASS|${id}|go test ok|${pkg}"
    else
      tail -5 /tmp/go_test_out.txt >&2
      record "FAIL|${id}|go test failed|${pkg}"
    fi
  fi
}

# --- TA: pairs, freshness, calculator (your "all pairs triggering" logic) ---
TA_AR="${TA_REPO}/arbitrage-realtime"
run_go_test "pairs_calc_slots" "$TA_AR" "./internal/calculator/..."
run_go_test "pairs_orchestrator" "$TA_AR" "./internal/orchestrator/..."
run_go_test "pairs_freshness" "$TA_AR" "./internal/market/..."
# NOTE: no gRPC load checks here. They previously ran `go test -run "Load"` against
# packages that contain no test matching /Load/, so go exited 0 with
# "[no tests to run]" and the suite recorded a PASS that asserted nothing.
# Re-add only alongside real load tests in the TA/DMS repos.

# --- DMS: filters, gates, decision engine ---
run_go_test "filter_readiness" "$DMS_REPO" "./internal/strategycore/..."

# --- TES: execution, contracts ---
run_go_test "exec_tes" "$TES_REPO" "./..." -run "Test|Contract"

# --- Optional: lifecycle unit tests (no live Redis if tests are pure unit) ---
run_go_test "life_lifecycle_unit" "$TA_AR" "./tests/e2e_lifecycle_integrity/lifecycle/..."

JSON_FILE="${REPORT_DIR}/latest_offline.json"
{
  echo "{"
  echo "  \"timestamp\": \"${TIMESTAMP}\","
  echo "  \"mode\": \"offline\","
  echo "  \"overall\": \"${OVERALL}\","
  echo "  \"note\": \"No exchange accounts or live services required\","
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

# Also write as latest.json for orchestrator
cp "$JSON_FILE" "${REPORT_DIR}/latest.json"

echo ""
echo "================================"
echo "Mode:    OFFLINE (learning)"
echo "Overall: ${OVERALL}"
echo "Report:  ${JSON_FILE}"
if [[ "$OVERALL" == "INCOMPLETE" ]]; then
  echo "--------------------------------"
  echo "INCOMPLETE is NOT a pass: one or more checks never ran."
  echo "Skipped checks:"
  for line in "${CHECKS[@]}"; do
    [[ "$line" == SKIP* ]] || continue
    IFS='|' read -r _ id detail extra <<< "$line"
    echo "  - ${id}: ${detail} (${extra})"
  done
  echo "Fix TA_REPO / DMS_REPO / TES_REPO in config.env, then re-run."
fi
echo "================================"

# Exit codes: 0 = PASS, 1 = FAIL, 2 = INCOMPLETE (checks skipped).
case "$OVERALL" in
  PASS)       exit 0 ;;
  INCOMPLETE) exit 2 ;;
  *)          exit 1 ;;
esac
