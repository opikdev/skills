# Opik Skills

Standards skills for AI coding agents. Nine matching skills that define how code, design, docs, copy, git, reviews, the public web, APIs, and databases must be done — minimal, consistent, and anti-generic.

## Install

```bash
npx skills add opikdev/skills            # all skills
npx skills add opikdev/skills --skill opik-coding-standards   # one skill
```

## Skills

| Skill | Enforces |
|---|---|
| [opik-coding-standards](skills/opik-coding-standards/SKILL.md) | Simple, tested, secure code; rare comments; root-cause fixes; verify before done |
| [opik-design-standards](skills/opik-design-standards/SKILL.md) | Token-driven, accessible, non-generic UI/UX; all states designed |
| [opik-docs-standards](skills/opik-docs-standards/SKILL.md) | Minimal, scannable docs under `docs/`; Diátaxis types; drift is a bug |
| [opik-copywriting-standards](skills/opik-copywriting-standards/SKILL.md) | User-centered, non-generic product copy; what/why/how-to-fix errors |
| [opik-git-standards](skills/opik-git-standards/SKILL.md) | Conventional subject-only commits; atomic changes; safe agent conduct |
| [opik-review-standards](skills/opik-review-standards/SKILL.md) | Evidence-based, severity-ranked, high-signal reviews |
| [opik-web-standards](skills/opik-web-standards/SKILL.md) | Rendering strategy, Core Web Vitals, technical/on-page SEO, WCAG 2.2 AA, platform hygiene |
| [opik-api-standards](skills/opik-api-standards/SKILL.md) | REST resource design, RFC 9457 errors, pagination, versioning, idempotency, spec-as-contract |
| [opik-database-standards](skills/opik-database-standards/SKILL.md) | Schema design, constraints, evidence-based indexing, safe migrations, query discipline |

## Structure

Each skill is one `SKILL.md` with a triggering description and enforceable rules, ending in a self-check. Skills cross-reference each other (reviews check against the other eight; design states pair with copy states).
