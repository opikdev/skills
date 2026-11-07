# Opik Skills

[![skills.sh](https://skills.sh/b/opikdev/skills)](https://skills.sh/opikdev/skills)

Standards skills for AI coding agents. Each skill gives your agent firm conventions for one kind of work, so it stops guessing at API shapes, commit style, or UI defaults.

Skills work with any agent that supports the [Agent Skills](https://agentskills.io) format, including Claude Code, Codex, and Cursor.

## Install

Install every skill:

```bash
npx skills add opikdev/skills
```

Install one skill:

```bash
npx skills add opikdev/skills --skill opik-git-standards
```

Add `-g` to install for all projects, or `-a <agent>` to pick an agent. The [skills CLI](https://github.com/vercel-labs/skills) needs Node.js 22.20 or later.

## Skills

Skills load automatically when a task matches. You can also name one in your prompt.

### opik-coding-standards

Keeps changes simple, surgical, and tested, with root-cause fixes and proof that the work runs.

**Use when:** writing, editing, refactoring, debugging, or testing code in any language.

### opik-backend-standards

Sets conventions for HTTP APIs and relational databases: RFC 9457 errors, versioning, pagination, idempotency, schema rules, and production-safe migrations for PostgreSQL and MySQL.

**Use when:** creating or changing endpoints, OpenAPI specs, schemas, migrations, indexes, or queries.

### opik-ui-standards

Covers visual design, product copy, accessibility, and public web pages, and bans the defaults that make interfaces look AI-generated. Includes a [web reference](skills/opik-ui-standards/references/web.md) for performance, SEO, and WCAG 2.2 AA.

**Use when:** designing, building, or reviewing a screen, component, landing page, website, or product email.

### opik-docs-standards

Keeps docs minimal, scannable, and accurate, with one Diátaxis type per page, ADRs, and no drift from the code.

**Use when:** writing a README, `AGENTS.md`, `docs/` page, ADR, or changelog, or when a code change makes a doc wrong.

### opik-git-standards

Enforces subject-only conventional commits, atomic changes, task branches, clear PRs, and safe agent conduct.

**Use when:** staging, committing, branching, pushing, or writing a PR.

> This skill forbids commit trailers, including `Co-Authored-By` lines that some tools add by default. Skip it if you want attribution.

### opik-review-standards

Produces evidence-based reviews with ranked severity, capped findings, and an explicit verdict.

**Use when:** reviewing a PR, diff, design, document, or skill, or auditing for bugs or security.

## How they behave

- Your project wins. Existing conventions and explicit instructions override these skills, and the agent notes the deviation.
- They fit together. The review skill judges work against whichever other skills you installed.
- Skills guide; they don't enforce. For rules that must never break, use linters, hooks, and CI.

## How they were tested

Each skill ran the same task with and without the skill on one model, scored by fixed checks:

| Skill | With skill | Without skill |
|---|---|---|
| backend | 10/10 | 3/10 |
| git | 7/7 | 4/7 |
| review | 7/7 | 6/7 |
| ui | 10/10 | 9/10 |
| coding | 6/6 | 6/6 |
| docs | 8/8 | 8/8 |

These are single runs, and the checks reward each skill's own conventions, so read them as a rough signal. The backend and git skills change behavior most. On a harder task, the coding skill kept the change smaller, and its test rule added a test in both reruns. The docs skill showed no measurable change.

## Develop

Run `pnpm install`, then `pnpm verify` to run the tests and validate every skill.

## License

[MIT](LICENSE). This project isn't affiliated with Comet's Opik LLM evaluation platform.
