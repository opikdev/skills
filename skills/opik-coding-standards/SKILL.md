---
name: "opik-coding-standards"
description: "Coding standards for simple, surgical, tested, comment-free code. Use for EVERY coding task — writing, editing, refactoring, debugging, or testing code — in any language, even if standards aren't mentioned. Pair with opik-backend-standards for APIs/databases and opik-ui-standards for UI."
---

# Coding Standards

Targets the failure modes that matter: over-engineering, scope creep, comment noise, symptom patches, and unverified "done".

## 1. Simplicity

- Write the minimum code that solves the stated problem. No abstractions, config options, or helpers "for later".
- No unrequested features or "while I'm here" improvements.
- Boring over clever: if a junior developer would pause on a line, rewrite it.
- Standard library and existing dependencies first. Add a dependency only when writing it yourself is riskier — say why.
- If a change grows several times larger than expected, stop and rethink the approach.
- Extract shared code on the third occurrence, not the second.

## 2. Surgical changes

- Touch only what the task requires: no renaming, reformatting, or reordering adjacent code. Every changed line traces to the request.
- Match the file's style and the project's linter, formatter, and config — project consistency beats external best practice.
- Unsure an API or idiom is current? Check the installed version's docs, not memory.
- Ambiguous request → state the assumption in one line or ask. Never guess silently. Before non-trivial work, restate the task as verifiable success criteria.
- One exception: fix any doc the change makes wrong (opik-docs-standards).

## 3. Comments: zero by default

- Names and small functions carry meaning. If code needs a "what" comment, refactor instead.
- Comment only the "why" code can't say: a business rule, an external-bug workaround (with link), a real gotcha. One line.
- Never: banners, section dividers, changelog notes, commented-out code, leftover TODO/FIXME.
- Docstrings only on public APIs where the ecosystem expects them, stating the contract (params, returns, errors).

## 4. Structure

- New files go where equivalent files already live; never invent a parallel structure. New projects use the stack's standard scaffold.
- Group by feature/domain; a growing `utils/` or `helpers/` is a smell.
- Dependencies point one way (UI → logic → data); no circular imports.
- Delete dead code — version control remembers.

## 5. Errors and security

- Never swallow errors: no empty `catch`, `except: pass`, or ignored rejections.
- Catch only what this layer can handle; let the rest propagate. No blanket try/catch.
- Messages state what failed and with which value: `Invalid duration: "1x"`.
- No hardcoded secrets (env vars + `.env.example`), validate external input at the boundary, parameterized queries only, no secrets or personal data in logs. These override simplicity.

## 6. Tests that can fail

- Test behavior, not implementation — refactoring internals must not break a test.
- Expected values are literals; never recompute them with production logic.
- Break the code once to confirm a new test catches it.
- Cover unhappy paths: invalid input, empty, boundaries, errors.
- Never weaken a test to pass (skip, loosen, delete assertions). A failure means find out whether the code or the test is wrong; if unclear, tell the user.
- No coverage filler: getters, constants, framework internals.
- Test at the lowest level that covers the risk, with the project's existing framework.

## 7. Root causes, not symptoms

- Reproduce, trace the bad state to where it originates, fix it there. No null checks, retries, or guards papering over the crash site.
- A fix without an explanation of why the bug happened is a guess — label it as one.
- If the real fix is out of scope, say so and let the user decide.

## 8. Done means proven

- Run the code, tests, linter, and type checker; show the output. If the repo has one gate command (`pnpm verify`, `pnpm check`), run that.
- Never present stubs, TODOs, or `NotImplemented` as complete. If something remains, state what and why.

## Self-check

1. Anything beyond the request, or a simpler way?
2. Any comment that restates the code?
3. Did I run it — tests, lint, types — and show the output?

If a rule conflicts with an explicit user instruction, the user wins — note the deviation in one line.
