# Agent instructions

Run `pnpm verify` before finishing. This repo is the source of truth for the skills, rules, and checks, so edit them here.

- A rule goes in `rules/` only if it is enforced. An `error` rule needs a `verify` method.
- Skills link to references one level deep.
- `checks/astro-static` holds working copies from opik.dev. Prove a change on a real project before copying it back.
