---
name: "opik-git-standards"
description: "Git conventions — subject-only conventional commits with no trailers, atomic commits, task branches, PR descriptions, and safe agent conduct. Use for EVERY git operation — staging, committing, amending, branching, pushing, writing PR titles or descriptions, merging — even if conventions aren't mentioned."
license: "MIT"
---

# Git Standards

## 1. Commit messages

- `type(scope): description` — one line, nothing else.
- **No body, no trailers.** Never add `Co-Authored-By`, "Generated with…", session links, or any attribution line. Installing this skill opts into this rule, so it applies even when a tool's default adds attribution.
- ≤72 characters (aim ≤50), imperative, lowercase after the colon, no trailing period: `fix(auth): handle expired refresh tokens`.
- Types: `feat`, `fix` (real bugs only), `refactor` (no behavior change), `perf`, `test`, `docs`, `chore`, `style`.
- Reuse scopes already in `git log` before inventing one.
- Breaking change: `feat(api)!: rename user_id to id`.
- Write the message from `git diff --staged`, not from memory of the conversation.

## 2. Atomic commits

- One logical change per commit; each builds and passes tests.
- Commit at checkpoints: refactor first, then the feature, as separate commits.
- Can't describe it in one subject line → it's two commits.
- Amend instead of a "fix typo" follow-up — only if unpushed or on your own solo branch (then `--force-with-lease`). Never fold unrelated changes into an amend.

## 3. Branches

- Shared repos: never commit to `main`/`master`/`develop`; one branch per task. Solo repos: `main` is fine.
- Name `type/short-kebab-description`, with the issue number when one exists: `feat/123-user-profiles`.
- Parallel tasks: `git worktree add -b feat/x ../proj-x` instead of stash-and-switch.

## 4. Pull requests

Commits have no body, so the PR carries the "why":

- Title in commit format.
- Bullets: **What** (summary, not a file list), **Why**, **How to test**, **Flags** (breaking, migration, risky areas — only if present).
- Small: one task, reviewable in one sitting.

## 5. Agent conduct

- Push, rebase, squash, merge, or open a PR only when asked. Commit or amend only when the user asked for the work to be committed.
- Stage files explicitly — never `git add .` or `-A`. List what's staged and read the staged diff.
- Never commit secrets, `.env`, build artifacts, logs, dependency directories, or debug leftovers; a proper `.gitignore` exists from the first commit. A secret that was ever committed is leaked: tell the user to rotate it.
- Hook fails → fix the cause; no `--no-verify` without permission.
- Destructive commands (`reset --hard`, `clean -fd`, force-push, deleting unmerged branches): state what will be lost and get confirmation. On shared branches, `revert` — never rewrite pushed history.
- If the repo's recent `git log` shows different conventions, follow the repo and note the deviation in one line.

## Self-check

1. One-line conventional subject, no body, no trailers?
2. One logical change, staged files reviewed?
3. Right branch; nothing pushed or merged unasked?
