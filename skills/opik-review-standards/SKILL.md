---
name: "opik-review-standards"
description: "Review standards for evidence-based, severity-ranked, capped reviews with an explicit verdict. Use for EVERY review task — a PR, diff, commit, file, design, document, copy, or skill; audits for bugs, security, or quality; or \"check this\", \"review this\", \"any issues?\", \"is this good?\". If work is being evaluated rather than created, apply this skill."
license: "MIT"
---

# Review Standards

Targets taste-based nitpicking, unranked finding dumps, speculative issues, logic bugs missed under polished surfaces, and invented findings.

## 1. Judge against the right bar

- First, requirement fidelity: does the work do what was asked — fully, correctly, without unrequested scope?
- "Good" means the installed standards, not personal taste. Load the matching skill before reviewing, if installed: coding, git, docs, backend, or ui.
- Project conventions that differ from the standards win; don't flag project-consistent work.

## 2. Severity

| Severity | Meaning | Blocks? |
|---|---|---|
| 🔴 Critical | Bug, security hole, data loss | Yes |
| 🟡 Warning | Correctness risk, real maintainability damage, standards violation | Yes, unless justified |
| 🔵 Suggestion | Optional improvement | No |
| `nit:` | Taste | Never |

## 3. Evidence or silence

- Every finding: location (file:line or section), what the work actually does, a concrete fix.
- No evidence in the artifact → drop it. No "this might be a problem".
- Verify before flagging: if claiming an API is misused or doesn't exist, check the installed version. A wrong finding costs more trust than a missed one.
- State confidence when not certain: "likely race — depends on whether X runs concurrently".

## 4. Signal

- Max 8 findings. More real issues → report the worst 8, summarize the rest in one line ("plus ~12 unchecked errors — same fix").
- Skip what a linter, formatter, or type checker catches; recommend running it.
- Don't narrate the diff.

## 5. Order

Review and report in this order: correctness → security → reliability → tests → maintainability. For design, docs, and copy: does it work for the user → accessibility → consistency → aesthetics. Never polish naming while a logic bug sits unmentioned.

## 6. AI-work failure modes

Polish is not a quality signal. Check explicitly:

- Hallucinated APIs, options, or imports — verify against installed versions.
- Patterns transplanted from another framework or language.
- New dependencies: real, maintained, necessary?
- Weakened verification: tests skipped, deleted, or loosened; checks disabled; `--no-verify`.
- A parallel structure invented instead of following the existing one.
- Fake completeness: TODO stubs, unimplemented branches, swallowed errors.
- Stale facts: versions, prices, policies stated as current without a source.

## 7. Verdict

- End with **approve**, **approve with nits**, or **request changes** — plus the exact list required to pass.
- Problem and fix only: no blame, sarcasm, or lectures.
- Nothing wrong → approve plainly. Never invent findings to look thorough.
- Praise only what's notable, in one line, after the findings.

## Output format

```markdown
## Review: <artifact>

**Verdict**: request changes

### Findings
1. 🔴 `auth.ts:42` — refresh token never expires; `exp` claim missing. Add a TTL per session policy.
2. 🟡 `api/users.ts:18` — unvalidated `id` passed to the query. Parse before use.
3. nit: `getUsrDta` → `getUserData`

### To pass
- Fix 1–2; nit optional.
```

If a rule conflicts with an explicit user instruction, the user wins — note the deviation in one line.
