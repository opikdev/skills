---
name: opik-git-standards
description: Git standards enforcing conventional subject-only commits, atomic changes, clean branches, and safe agent conduct. Use this skill for EVERY git operation — committing, staging, branching, pushing, writing PR/MR titles and descriptions, merging, or reviewing diffs — in any project, even if the user doesn't mention git conventions. If a git command will be run or a commit/PR will be written, apply this skill.
---

# Git Standards

Rules for all git work. They target the main failure modes: vague dump-commits, noisy trailers, committing to shared branches, blind staging, and unexplained PRs.

## 1. Commit messages: conventional, subject-only

Format: `type(scope): description` — one line, nothing else.

- **No body. No trailers.** Never add `Co-Authored-By`, `Generated with Claude Code`, or any attribution/footer lines.
- Subject ≤ 72 characters (aim ≤ 50), imperative mood, lowercase after colon, no trailing period: `fix(auth): handle expired refresh tokens`.
- Types used precisely: `feat` (new capability), `fix` (actual bug fix only), `refactor` (restructure, no behavior change), `perf`, `test`, `docs`, `chore` (maintenance), `style` (formatting only). Never `fix` for a refactor or `chore` for a feature.
- Scope from the affected module/area; use the same scope names consistently across the repo (check `git log` for established scopes before inventing one).
- Description states the specific change: `fix(api): return 404 for deleted users` — never `fix bug`, `update code`, `wip`, `changes`.
- `BREAKING CHANGE`: use `!` after type/scope (`feat(api)!: rename user_id to id`) since there is no body to carry a footnote.
- Write the message from the actual staged diff (`git diff --staged`), not from memory of the conversation.

## 2. Atomic commits

- One logical change per commit. Never mix a feature with a refactor, or a fix with formatting churn.
- Each commit must build and pass tests on its own — no "part 1/2" broken states.
- Commit at logical checkpoints during a task, not one giant dump at the end. If work naturally splits (refactor first, then feature), commit it as that sequence.
- If the diff can't be described in one short subject line, it's probably two commits.
- **Amend over fixup-commits**: if new changes belong to the last commit (same logical change — a missed file, a typo in it, review feedback on it), `git commit --amend` instead of a `fix typo` follow-up commit. Only when the commit is unpushed, or on your own solo feature branch (then push with `--force-with-lease`). Never amend a commit others may have pulled, and never fold *unrelated* changes into an amend — that breaks atomicity.

## 3. Branch discipline

- In shared repos (any repo others also pull/push — teams, open source, PR-reviewed projects): never commit directly to `main`/`master`/`develop`. Every task gets its own branch. In solo personal repos, committing to `main` is acceptable.
- Naming: `type/short-kebab-description` — `feat/user-profiles`, `fix/login-timeout`, `chore/upgrade-node`. Include the issue number when one exists: `feat/123-user-profiles`.
- One branch = one task. Unrelated work goes on a new branch off the base, not piled onto the current one.
- For parallel tasks, prefer worktrees over branch-switching with dirty state: `git worktree add ../proj-feat-x feat/x` gives each task its own directory and branch — no stashing, no half-done work colliding. Remove with `git worktree remove` when merged.
- Delete branches after merge.

## 4. PR/MR quality

With no commit bodies, the PR description is where "why" lives — it is not optional.

- Title follows the same conventional format as commits.
- Description covers, compactly (bullets over prose, per docs standards):
  - **What** changed (summary, not a file list)
  - **Why** (the problem or goal)
  - **How to test** (specific scenarios a reviewer should verify)
  - **Flags**: breaking changes, migrations, API changes, risky areas — only if present
- Keep PRs small and focused: one branch, one task, reviewable in one sitting. A 2,000-line mixed PR is a process failure — split it.

## 5. Hygiene

- Never commit secrets, credentials, `.env` files, build artifacts, logs, or dependency directories. Ensure a proper `.gitignore` exists from the first commit; add missing entries before staging.
- No debug leftovers (`console.log`, `print`, commented-out code) in any commit.
- Review the staged diff before every commit — read what is actually being committed.
- If a secret was ever committed, treat it as leaked: tell the user to rotate it; removing the file in a later commit is not enough.

## 6. Safe history

- Never force-push a shared branch; never rewrite history that others may have pulled.
- On shared branches, undo with `git revert`, not `git reset`.
- `--force-with-lease` only on your own feature branch, only when needed (e.g., after an explicitly requested rebase).
- Never run destructive commands (`reset --hard`, `clean -fd`, branch deletion with unmerged work) without stating what will be lost and getting confirmation.

## 7. Agent conduct

- Never push, rebase, squash, merge, or open a PR unless the user asked for that operation. Committing and amending are allowed when the user asked for the work to be committed; amend follows the §2 conditions.
- Stage deliberately: add only the files belonging to the task — never blind `git add .` / `git add -A`. List what's being staged.
- Before committing, run the project's tests/linter if present (per coding standards — verify before done).
- If pre-commit hooks fail, fix the cause; never `--no-verify` without explicit permission.
- Match the repo's existing conventions if they differ from these rules (check recent `git log` first) — repo consistency wins; note the deviation in one line.

## Self-check before finishing

1. Subject-only conventional message, ≤72 chars, correct type, no trailers?
2. Is the commit atomic — one logical change that builds and passes tests?
3. On a properly named feature branch, not a shared branch?
4. Staged files reviewed and task-only — no secrets, artifacts, or debug leftovers?
5. If a PR: what/why/how-to-test written, flags noted, scope small?

If a rule conflicts with an explicit user instruction or the repo's established conventions, those win — note the deviation in one line.
