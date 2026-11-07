#!/usr/bin/env bash
set -uo pipefail
cd "$CLAUDE_PROJECT_DIR"
cat >/dev/null
upstream=$(git rev-parse '@{upstream}' 2>/dev/null || git rev-parse origin/main)
[ -z "$(git status --porcelain)" ] && [ "$(git rev-parse HEAD)" = "$upstream" ] && exit 0
stamp="$(git rev-parse --git-dir)/verified-state"
state=$({ git rev-parse HEAD; git status --porcelain; git diff HEAD; } | shasum)
[ "$(cat "$stamp" 2>/dev/null)" = "$state" ] && exit 0
if output=$(pnpm verify 2>&1); then
  printf '%s' "$state" >"$stamp"
  exit 0
fi
printf 'pnpm verify failed. Fix the failure before finishing.\n%s\n' "$(printf '%s' "$output" | tail -n 80)" >&2
exit 2
