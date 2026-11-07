#!/usr/bin/env bash
set -euo pipefail
cd "$CLAUDE_PROJECT_DIR"
file=$(jq -r '.tool_input.file_path // empty')
[ -n "$file" ] && [ -f "$file" ] || exit 0
pnpm exec oxfmt --no-error-on-unmatched-pattern --write "$file" >/dev/null 2>&1 || true
