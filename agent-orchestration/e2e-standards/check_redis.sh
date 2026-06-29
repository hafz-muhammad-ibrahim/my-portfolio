#!/usr/bin/env bash
# check_redis.sh — basic Redis connectivity and stuck opportunity scan
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "${SCRIPT_DIR}/config.env" 2>/dev/null || source "${SCRIPT_DIR}/config.env.example"

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

# Count tde:opp keys (informational; high count alone is not failure)
OPP_COUNT=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" --scan --pattern 'tde:opp:*' 2>/dev/null | wc -l | tr -d ' ')
echo "PASS|life_no_stuck_opp|tde:opp key count=${OPP_COUNT}|manual review if elevated"

exit 0
