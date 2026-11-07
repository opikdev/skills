---
name: "opik-docs-standards"
description: "Documentation conventions — minimal, scannable docs in docs/ with the root README, AGENTS.md, and CLAUDE.md as a map; one Diátaxis type per page; ADRs; zero drift. Use for EVERY task that writes or updates a README, AGENTS.md, CLAUDE.md, docs/ file, ADR, changelog, guide, or API docs — and whenever a code change makes an existing doc wrong."
license: "MIT"
---

# Docs Standards

## 1. Earn the space

- Document only what code can't say: purpose, setup, decisions, gotchas, contracts. A section deletable without loss gets deleted. No doc beats a stale doc.
- No preamble ("In this document…"), no marketing, no closing summary.
- Bullets for parallel items, tables for config and options, Mermaid for flows and architecture, code blocks for anything runnable. Prose only where reasoning needs sentences.
- Imperative, second person: "Run `npm test`". One H1, no skipped levels, specific headings ("Configure webhooks", not "More info").

## 2. Layout

- Beyond the README, docs live in `docs/`, one topic per kebab-case file (`docs/deployment.md`).
- Root README, AGENTS.md, and CLAUDE.md are the map: brief content plus links into `docs/`. Never duplicate — link.
- README past ~1,500 words → move detail to `docs/`; keep install, a minimal example, and links.
- Organize `docs/` by reader goal, not code module.

## 3. One type per page (Diátaxis)

| Type | Reader needs | Style |
|---|---|---|
| Tutorial | Learn from zero | Linear steps guaranteed to work, no theory |
| How-to | Finish a task | Goal-titled recipe |
| Reference | Look up facts | Complete tables, no narrative |
| Explanation | Understand why | Architecture, trade-offs |

Pick the type first; never mix two on one page.

## 4. Zero drift

- Every code change ends with: does any README, AGENTS.md, `docs/` page, or changelog now lie? Fix it in the same change.
- Delete docs for removed features.
- Run every command and snippet before committing. No undefined variables; obvious placeholders (`<YOUR_API_KEY>`).
- Config documented as a table: option, type, default, description.
- API reference is generated from source (docstrings, OpenAPI) — never a hand-kept copy.

## 5. ADRs

Significant decisions (framework, schema, rejected alternatives) get `docs/decisions/NNN-short-title.md`, written when the decision is made:

```markdown
# NNN. Use PostgreSQL over MongoDB
- **Status**: accepted
- **Context**: 2–3 lines — problem and constraints
- **Decision**: 1–2 lines
- **Consequences**: bullets — what gets easier or harder
```

## Self-check

1. Could any section be deleted without loss?
2. Right type, right place, linked from the root, no duplication?
3. Every snippet run; no doc left lying after this change?

If a rule conflicts with an explicit user instruction or project convention, those win — note the deviation in one line.
