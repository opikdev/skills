#!/usr/bin/env bash
set -uo pipefail
command=$(jq -r '.tool_input.command // empty')
git_command='git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?'
block() {
  printf '%s\n' "$1" >&2
  exit 2
}
printf '%s' "$command" | grep -Eq "${git_command}add[[:space:]]+(\.|-A|--all)[[:space:]]*(\$|&&|;|\|)" &&
  block 'GIT-003: stage files by name, not with git add . or -A.'
printf '%s' "$command" | grep -Eq "(${git_command}[^;&|]*--no-verify|${git_command}commit[^;&|]*[[:space:]]-n([[:space:]]|\$)|LEFTHOOK=0)" &&
  block 'GIT-004: do not skip git hooks. Fix what the hook reports.'
exit 0
