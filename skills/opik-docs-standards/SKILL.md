---
name: opik-docs-standards
description: Documentation standards enforcing minimal, compact, scannable, well-organized docs that serve both humans and AI agents. Use this skill for EVERY documentation task — writing or updating a README, AGENTS.md, CLAUDE.md, docs/ files, API docs, architecture decision records, changelogs, guides, or onboarding docs — and whenever a code change makes existing docs stale. If documentation will be written or changed, apply this skill.
---

# Documentation Standards

Rules for how all documentation must be written. They target the main doc failure modes: bloat, drift from the code, mixed doc types, untested examples, and walls of prose nobody scans.

## 1. Minimal — docs earn their place

Document only what the code cannot say: purpose, setup, decisions, gotchas, contracts. Never narrate what reading the code already shows. No doc is better than a stale doc or a padding doc. AI-generated docs bloat the way AI code over-comments — same ban: if a section can be deleted without losing information someone needs, delete it.

## 2. Compact, scannable style

Every doc is short, direct, and skimmable — good for humans and AI agents reading it as context.

- Straight to the point: no preamble, no filler intros ("In this document we will..."), no long explanations where a short one works, no marketing fluff, no closing summaries.
- Format for scanning: bullet points for parallel items, tables for structured facts (config, options, comparisons), Mermaid diagrams for flows/architecture/relationships, code blocks for anything runnable. Prose only where reasoning genuinely needs sentences.
- Active voice, imperative, second person: "Run `npm test`", not "the user may run the test command".
- Short sentences. One idea per bullet. Bold only key warnings/values.
- Proper heading hierarchy: one H1, H2 for sections, H3 below — never skip levels. Headings are the reader's index; make them specific ("Configure webhooks", not "More info").

## 3. Organization: docs/ dir with root as the map

- All documentation beyond the README lives in `docs/`, one topic per file, clear kebab-case filenames (`docs/deployment.md`, not `docs/misc2.md`).
- Root `README.md` (and `AGENTS.md`/`CLAUDE.md` when the project has AI-agent context) act as the map: brief content + links into `docs/`. Never duplicate content between root files and `docs/` — link instead.
- When README content grows past roughly 1,500 words, split the detail into `docs/` and keep the README to install, a minimal example, and links.
- Structure `docs/` by reader goal, not by code module. As it grows, group by Diátaxis type (§4).

## 4. Know the doc type before writing (Diátaxis)

Four distinct types — never mix them in one page:

| Type | Reader's need | Style |
|---|---|---|
| Tutorial | Learn from zero | Linear steps, guaranteed to work, no theory |
| How-to guide | Get a specific task done | Goal-titled recipe ("Deploy to production") |
| Reference | Look up exact facts | Complete, accurate, tables — no narrative |
| Explanation | Understand why | Architecture, trade-offs, background |

Decide the type first; it dictates tone, structure, and what to leave out. A how-to that drifts into explanation, or a reference padded with tutorial steps, fails the reader.

## 5. Docs live with the code — drift is a bug

- Docs are markdown in the repo, versioned, reviewed like code.
- Every code change ends with a doc check: does README, AGENTS.md, `docs/`, or the changelog now lie? Update in the same change — never "later".
- When touching a feature, fix any stale doc you find about it (this is the one exception to surgical scope — a wrong doc is actively harmful).
- Delete docs for removed features; version control remembers.

## 6. Every example must work

- All commands and code snippets are copy-pasteable and actually executed/verified before committing. An example that fails destroys trust in the whole doc.
- No undefined variables in examples — everything a snippet uses is shown or stated.
- Document configuration as tables: option, type, default, description.
- Use realistic values in examples, and placeholders that are obviously placeholders (`<YOUR_API_KEY>`).

## 7. Architecture Decision Records

Significant decisions — framework choice, schema design, rejected alternatives, trade-offs — get a short ADR in `docs/decisions/` (`NNN-short-title.md`):

```markdown
# NNN. Use PostgreSQL over MongoDB
- **Status**: accepted
- **Context**: (2-3 lines: the problem and constraints)
- **Decision**: (1-2 lines: what was chosen)
- **Consequences**: (bullets: what this makes easier/harder)
```

This is where the "why" lives that minimal code comments don't carry. Write the ADR when the decision is made, not retroactively.

## 8. API docs from source

- Public API documentation is generated from the single source of truth: docstrings/JSDoc for libraries, OpenAPI spec for HTTP APIs — never a hand-maintained parallel copy that can drift.
- Docstrings state contract only: params, returns, errors, one example. No implementation narration.
- Only public surface gets docstrings; internal code stays comment-free per coding standards.

## Self-check before finishing

1. Could any section be deleted without losing needed information? Delete it.
2. Is it scannable in 30 seconds — headings, bullets, tables, diagrams doing the work?
3. Right doc type, right location (`docs/`), linked from the root map, no duplication?
4. Did I run every command and snippet shown?
5. After this change, does any existing doc now lie? Fixed?

If a rule conflicts with an explicit user instruction or an established project convention, those win — note the deviation in one line.
