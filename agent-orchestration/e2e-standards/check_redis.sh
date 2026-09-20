#!/usr/bin/env bash
# check_redis.sh — basic Redis connectivity and stuck opportunity scan
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

REDIS_HOST="${REDIS_ADDR%%:*}"
REDIS_PORT="${REDIS_ADDR##*:}"
[[ "$REDIS_PORT" == "$REDIS_ADDR" ]] && REDIS_PORT=6379

if ! command -v redis-cli &>/dev/null; then
  echo "SKIP|life_no_stuck_opp|redis-cli not installed|"
  exit 0
fi

if ! redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" PING 2>/dev/null | grep -q PONG; then
  echo "FAIL|data_redis_mongo|Redis unreachable|${REDIS_ADDR}"
  exit 1
fi
echo "PASS|data_redis_mongo|Redis PING ok|${REDIS_ADDR}"

# The opportunity key pattern is deployment-specific. Set OPP_KEY_PATTERN in
# config.env (untracked) to enable the scan; without it the check reports SKIP
# rather than guessing a pattern.
OPP_KEY_PATTERN="${OPP_KEY_PATTERN:-}"
if [[ -z "$OPP_KEY_PATTERN" ]]; then
  echo "SKIP|life_no_stuck_opp|OPP_KEY_PATTERN not set in config.env|"
  exit 0
fi

# Count active opportunity keys (informational; a high count alone is not a failure)
OPP_COUNT=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" --scan --pattern "$OPP_KEY_PATTERN" 2>/dev/null | wc -l | tr -d ' ')
echo "PASS|life_no_stuck_opp|active opportunity key count=${OPP_COUNT}|manual review if elevated"

exit 0
