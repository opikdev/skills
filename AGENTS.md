# Agent instructions

Run `pnpm verify` before finishing. This repo is the source of truth for the skills, and it holds skills and their evals only.

- Skills link to references one level deep.
- Put rules a machine can verify in a project's checks, not in a skill.
- `pnpm eval:triggers` starts real agent sessions and uses plan usage. Ask before running it, and use `--limit` when you can.
