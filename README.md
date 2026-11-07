# Opik Skills

An engineering kit that makes AI agents follow software standards. Checks enforce what a machine can verify, and skills guide the rest.

## What's in the kit

| Part | Job | Location |
|---|---|---|
| Skills | Tell the agent how | [`skills/`](skills/) |
| Rules | Register each enforced rule with its ID, severity, reason, and verification method | [`rules/`](rules/) |
| Checks | Prove the work is right, in agent hooks and CI | [`checks/`](checks/) |

Skills:

| Skill | Covers |
|---|---|
| [opik-coding-standards](skills/opik-coding-standards/SKILL.md) | Simple, surgical, tested code and root-cause fixes |
| [opik-backend-standards](skills/opik-backend-standards/SKILL.md) | HTTP APIs, schemas, migrations, and queries |
| [opik-ui-standards](skills/opik-ui-standards/SKILL.md) | Visual design, copy, and public web pages |
| [opik-docs-standards](skills/opik-docs-standards/SKILL.md) | Minimal, accurate docs |
| [opik-git-standards](skills/opik-git-standards/SKILL.md) | Commits, branches, PRs, and safe agent conduct |
| [opik-review-standards](skills/opik-review-standards/SKILL.md) | Evidence-based reviews with an explicit verdict |

## Install the skills

```bash
npx skills add opikdev/skills -g -a claude-code codex
```

This repo is private, so the command needs GitHub access.

## Adopt the checks

Follow [Add the kit to a project](docs/add-the-kit-to-a-project.md). The available set is `checks/astro-static`, proven on opik.dev.

## Develop the kit

Run `pnpm install`, then `pnpm verify` to run the tests and validate every rule and skill.

This repo is the source of truth. See [why the kit favors checks](docs/decisions/001-checks-before-prose.md).
