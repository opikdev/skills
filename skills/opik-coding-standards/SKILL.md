---
name: opik-coding-standards
description: Coding standards enforcing simple, reliable, well-tested, well-organized code with minimal comments. Use this skill for EVERY coding task — writing new code, editing existing code, refactoring, code review, debugging, or generating tests — in any language or framework, even if the user doesn't mention standards, style, or quality. If code will be written or changed, apply this skill.
---

# Coding Standards

Rules for how all code must be written. They target the most common AI-coding failure modes: over-engineering, comment noise, ignoring stack conventions, useless tests, and messy structure.

## 1. Simplicity first

Write the minimum code that correctly solves the stated problem. Nothing speculative.

- No abstractions, layers, interfaces, generics, or config options "for later". Apply YAGNI: build only what the task requires today.
- No unrequested features, no "while I'm here" improvements, no helper utilities nobody asked for.
- Prefer boring, obvious solutions over clever ones. If a junior developer would need to pause to understand a line, rewrite it plainly.
- Prefer the standard library and existing project dependencies. Add a new dependency only when writing it yourself would be significantly more code or riskier — and say so.
- A rough size check: if a fix or feature balloons to several times the size you'd expect, stop and reconsider the approach before continuing.
- Duplication rule of thumb: extract shared code after the third occurrence (rule of three), not preemptively. DRY applies to knowledge/business rules, not to any two lines that happen to look alike.

**Surgical changes.** When editing existing code, touch only what the task requires. Do not rename, reformat, reorder, or "clean up" adjacent code. Match the existing style of the file, even if you'd write it differently. Every changed line must trace directly to the request.

**Think before coding.** If the request is ambiguous, state your assumption in one line or ask — never silently guess and barrel ahead. Before non-trivial work, restate the task as verifiable success criteria.

## 2. Comments: rare, short, and only "why"

Default to zero comments. Code must be self-documenting through clear naming and small, well-named functions. If you feel a comment explaining *what* the code does is needed, refactor the code instead.

Write a comment only when it carries information the code cannot:

- **Why**, not what: a non-obvious decision, business rule, or constraint ("rate limited to 10/s per vendor contract")
- A workaround for an external bug, with a link/reference
- A genuine gotcha that would trap the next editor (ordering requirement, unit mismatch, security consequence)

When you do comment: one short, precise line. No banners, no section dividers, no changelog comments, no commented-out code, no `TODO`/`FIXME` left behind. Docstrings/JSDoc only on public APIs where the ecosystem expects them, and only stating contract (params, return, errors) — not narrating implementation.

## 3. Follow the stack's own conventions

Before writing, identify the tech stack and follow its current official/community best practices — not generic patterns transplanted from another language.

- Universal principles apply everywhere: KISS, YAGNI, DRY (per rule of three), single responsibility, fail fast, explicit error handling, no magic numbers, no dead code.
- Then layer stack-specific idioms. Examples of what this means in practice:
  - **React**: function components + hooks, derive state instead of syncing it, keys on lists, no state duplication, colocate state near usage, follow Rules of Hooks, server/client component rules if Next.js.
  - **Python**: PEP 8, type hints, virtualenv-respecting imports, context managers for resources, exceptions over error codes.
  - **TypeScript/Node**: strict mode, no `any` unless justified in one comment, ESM/CJS consistency with the project, async/await over raw promises chains.
  - **Go**: gofmt, small interfaces, errors as values, no premature goroutines.
- If the project already has a linter, formatter, or config (`.eslintrc`, `pyproject.toml`, `.editorconfig`, existing CLAUDE.md) — those win over personal preference. Never fight the project's established conventions; consistency within the codebase beats external "best practice".
- If unsure whether a practice is current (frameworks move fast), check the project's installed version and follow the docs for that version rather than memory.

## 4. Tests that actually test

Code isn't done until it's tested. But only write tests that earn their place.

**What to test (test pyramid — keep it bottom-heavy):**
- **Unit tests (most)**: pure logic, branching, edge cases, error paths. Fast, isolated, no I/O. Mock external dependencies.
- **Integration tests (some)**: the seams — modules working together, DB queries, API route handlers. Only where units interacting is where the risk is.
- **E2E tests (few)**: only the critical user journeys (login, checkout, the core workflow). Not one per feature.
- Don't reach higher up the pyramid than needed: logic that can be unit-tested must not be tested by spinning up a database or hitting HTTP.

**Test quality rules (non-negotiable):**
- Test observable behavior and requirements, not implementation details. If refactoring internals (e.g., `.reduce()` → `for` loop) breaks the test, the test is wrong.
- Never duplicate production logic inside a test to compute the expected value — state expected outcomes as literals. A test that recomputes the answer just runs the code twice.
- Every test must be able to fail. Before trusting a new test, mentally (or actually) break the code and confirm the test catches it.
- Each test: independent, deterministic, one behavior, named after the behavior ("rejects expired token"), Arrange-Act-Assert structure.
- Cover the unhappy paths: invalid input, empty/null, boundaries, error handling — not just the golden path.
- Never weaken a test to make it pass (no skipping, no loosened tolerances, no deleting assertions). A failing test means investigate: the code or the test is wrong — determine which with equal scrutiny, and if the fix isn't obvious, surface it to the user instead of papering over it.
- No filler tests written for coverage numbers: no testing framework internals, getters/setters, constants, or third-party libraries.

Use the project's existing test framework and follow its conventions. Run the tests and show they pass before declaring done.

## 5. Organized code and structure

- Follow the project's existing structure. Put new files where equivalent files already live; never invent a parallel structure.
- For new projects, use the stack's standard layout (e.g., `src/` conventions, framework CLI scaffolding norms) — not a homemade one.
- One responsibility per file/module; group by feature/domain rather than dumping everything into generic buckets (`utils/`, `helpers/`, `misc/`) — a growing `utils` file is a design smell.
- Keep functions small and single-purpose; keep files focused (roughly: if a file needs a scrollbar map, split it).
- Names carry the design: precise, consistent, unabbreviated names for files, functions, and variables. Naming is where "self-documenting" happens.
- Dependencies point one direction (UI → logic → data). No circular imports, no reaching across layers.
- Delete dead code instead of keeping it "just in case" — version control remembers.

## 6. Security basics

- Never hardcode secrets, API keys, tokens, or credentials — use environment variables or the project's secret store; add a `.env.example`, never commit `.env`.
- Treat all external input (user input, request params, file contents, API responses) as untrusted: validate and sanitize at the boundary.
- Database access: parameterized queries / ORM bindings only — never string-concatenated SQL.
- Never log passwords, tokens, or personal data. Escape output where injection is possible (HTML/XSS, shell commands, paths).
- These override simplicity: a shortcut that weakens security is not "simpler", it's broken.

## 7. Error handling discipline

- Never swallow errors: no empty `catch`, no `except: pass`, no ignoring rejected promises or returned errors.
- Fail fast with actionable messages that state what failed and with which value ("Invalid duration: \"1x\"" — not "error occurred").
- Handle errors at the layer that can actually do something about them; let everything else propagate. Do not blanket-wrap code in try/catch — that's defensive noise, not reliability.
- Only catch what you expect and can handle; unexpected errors should surface loudly, not be converted into silent fallbacks or default values.

## 8. Fix root causes, not symptoms

When debugging, reproduce and diagnose the actual cause before writing any fix. Patching the visible symptom — adding a null check here, a retry there, a defensive guard around the crash — leaves the bug alive and buries it deeper.

- Trace the failure back to where the bad state originates; fix it there.
- If a "fix" doesn't come with an explanation of why the bug happened, it's a guess — say so instead of presenting it as a fix.
- If the true fix is out of scope, state that explicitly and let the user decide, rather than silently shipping a workaround.

## 9. Verify before declaring done

"Done" means proven working, not "looks right".

- Run the code. Run the tests. Run the project's linter, formatter, and type checker if present. Show the output.
- Never claim something works without executing it; never assume a change compiles.
- No half-finished work presented as complete: no leftover TODO/FIXME, no stubbed `NotImplemented`/`pass` bodies, no dead code paths "to finish later". If something genuinely can't be completed, say exactly what remains and why.

## Self-check before finishing

Before presenting code, verify:
1. Could this be simpler? Is anything here beyond what was asked?
2. Are there any comments that just restate the code? Remove them.
3. Does it follow this stack's idioms and this project's existing conventions?
4. Do tests assert behavior with literal expectations, cover error paths, and actually fail when the code is broken?
5. Is every file in the right place, every name clear, nothing dead or duplicated?
6. No hardcoded secrets, unvalidated input, or swallowed errors?
7. Did I run it — code, tests, linter — and prove it works?

If a rule here conflicts with an explicit user instruction, the user wins — note the deviation in one line.
