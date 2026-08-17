---
name: opik-review-standards
description: Review standards enforcing evidence-based, severity-ranked, high-signal reviews of code, designs, docs, and copy. Use this skill for EVERY review task — reviewing a PR, diff, commit, file, design, document, or any work product; auditing for bugs, security, or quality; or when asked "check this", "review this", "any issues?", or "is this good?". If work is being evaluated rather than created, apply this skill.
---

# Review Standards

Rules for how all reviews must be done. They target the main review failure modes: taste-based nitpicking, unranked finding dumps, speculative issues without evidence, missed logic bugs under polished surfaces, and invented findings to look thorough.

## 1. Review against the standards suite

- "Good" is defined by the opik standards skills: coding, design, docs, copywriting, git, web, api, database. Report violations of those — not personal taste. If a relevant standards skill exists for the artifact type, load it before reviewing.
- First check requirement fidelity: does the change actually do what was asked — fully, correctly, and without unrequested scope creep? A beautiful diff that solves the wrong problem fails review.
- If the project has its own conventions/config that differ from the standards, the project wins (consistency rule); don't flag project-consistent code as violations.

## 2. Severity-ranked findings

Every finding gets exactly one severity:

| Severity | Meaning | Blocking? |
|---|---|---|
| 🔴 Critical | Will cause bugs, security issues, data loss | Yes |
| 🟡 Warning | Should fix before merge — correctness risk, maintainability damage, standards violation | Yes, unless justified |
| 🔵 Suggestion | Optional improvement | No |
| Nit | Style/naming taste, prefixed `nit:` | Never |

Never present nits with the same weight as critical findings. Blocking = correctness, security, major maintainability, policy violations — nothing else blocks.

## 3. Evidence or silence

- Every finding states: file, line/location, the evidence (what the code/design actually does), and a concrete recommendation.
- If a finding can't point at actual evidence in the artifact, drop it. No speculative "this might be a problem" hedging.
- Verify before flagging: if claiming an API is misused or a function doesn't exist, check — a wrong finding costs more trust than a missed one.
- State confidence when it's not certain ("likely race condition — depends on whether X can be called concurrently").

## 4. Signal over noise

- Cap at ~8 findings per review; force prioritization. One focused set beats 20 scattered notes — if a review highlights everything, it highlights nothing.
- If more than 8 real issues exist, report the worst 8 and summarize the rest in one line ("plus ~12 similar unchecked-error cases — same fix throughout").
- Skip everything a linter/formatter/type-checker already catches — recommend running the tool instead of enumerating its output.
- Don't restate the diff or narrate what the code does; findings only.

## 5. Review in priority order

Work through the artifact in this order, and report in this order:

1. **Correctness** — logic errors, edge cases, null/empty handling, boundary conditions, off-by-ones
2. **Security** — authz checks, injection, secrets in code, unvalidated input, PII in logs
3. **Reliability** — error handling, timeouts, resource cleanup, concurrency
4. **Tests** — missing cases tied to this change, tests that can't fail, weakened assertions
5. **Maintainability** — complexity, duplication, structure, naming

Never polish naming while a logic bug sits unmentioned. For designs/docs/copy, the analogue: function (does it work for the user) → accessibility → consistency → aesthetics.

## 6. AI-code failure modes

AI-generated work is syntactically polished but can be confidently, subtly wrong — polish is not a quality signal. Explicitly check:

- **Hallucinated APIs**: methods, options, or imports that don't exist in the actual dependency versions — verify against the installed version, not memory.
- **Transplanted patterns**: idioms from another framework/language applied where they don't belong.
- **Dependency provenance**: newly added packages — are they real, maintained, and necessary?
- **Weakened verification**: tests deleted, skipped, or loosened; CI checks disabled; `--no-verify` anywhere.
- **Architecture fit**: does the change follow the existing structure or silently invent a parallel one?
- **Fake completeness**: TODO stubs, unimplemented branches, or error paths that swallow instead of handle.

## 7. Verdict and tone

- End every review with an explicit verdict: **approve** / **approve with nits** / **request changes** — and, if changes are requested, the exact list of what must change to pass.
- Findings state the problem and the fix — never blame, never sarcasm, never lecture.
- If nothing is wrong, say so plainly and approve. Never invent findings to appear thorough — a clean approval is a valid review result.
- Praise only what's genuinely notable, in one line, after the findings.

## Output format

```markdown
## Review: <artifact>

**Verdict**: request changes

### Findings
1. 🔴 `auth.ts:42` — refresh token never expires; `exp` claim missing. Add TTL per session policy.
2. 🟡 `api/users.ts:18` — unvalidated `id` param passed to query. Validate/parse before use.
3. nit: `getUsrDta` → `getUserData`

### To pass
- Fix findings 1–2; nit optional.
```

## Self-check before finishing

1. Did I verify the change does what was asked before judging how it's done?
2. Is every finding evidenced (file, line, actual behavior) — nothing speculative?
3. Ranked by severity, capped for signal, ordered correctness → security → reliability → tests → maintainability?
4. AI failure modes checked — APIs verified, tests not weakened, structure fits?
5. Explicit verdict given, and zero invented findings?

If a rule conflicts with an explicit user instruction or project convention, those win — note the deviation in one line.
