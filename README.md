# Opik Skills

Standards skills for AI coding agents. Each skill gives an agent the judgment a linter can't.

| Skill | Covers |
|---|---|
| [opik-coding-standards](skills/opik-coding-standards/SKILL.md) | Simple, surgical, tested code and root-cause fixes |
| [opik-backend-standards](skills/opik-backend-standards/SKILL.md) | HTTP APIs, schemas, migrations, and queries |
| [opik-ui-standards](skills/opik-ui-standards/SKILL.md) | Visual design, copy, and public web pages |
| [opik-docs-standards](skills/opik-docs-standards/SKILL.md) | Minimal, accurate docs |
| [opik-git-standards](skills/opik-git-standards/SKILL.md) | Commits, branches, PRs, and safe agent conduct |
| [opik-review-standards](skills/opik-review-standards/SKILL.md) | Evidence-based reviews with an explicit verdict |

## Install

```bash
npx skills add opikdev/skills -g -a codex
```

This repo is private, so the command needs GitHub access.

## Develop

Run `pnpm install`, then `pnpm verify` to run the tests and validate every skill.
