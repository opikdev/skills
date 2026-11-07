# Add the kit to a project

These steps fit a static Astro site that uses pnpm. Use `checks/astro-static`.

1. Install `gitleaks` with `brew install gitleaks`.
2. Copy the contents of `checks/astro-static` into the project root.
3. Add the dev dependencies:

   ```bash
   pnpm add -D -E oxlint oxfmt lefthook @axe-core/playwright playwright-core node-html-parser @lhci/cli
   ```

4. Allow the Lefthook build by adding `lefthook: true` under `allowBuilds` in `pnpm-workspace.yaml`.
5. Add these scripts to `package.json`:

   ```json
   {
     "format": "oxfmt --write .",
     "format:check": "oxfmt --check .",
     "lint": "oxlint --deny-warnings --report-unused-disable-directives .",
     "check": "astro check",
     "test": "node --test \"scripts/*.test.mjs\"",
     "check:site": "node scripts/check-site.mjs",
     "check:a11y": "node scripts/check-a11y.mjs",
     "lighthouse": "lhci autorun",
     "verify": "pnpm format:check && pnpm lint && pnpm check && pnpm test && pnpm build && pnpm check:site",
     "prepare": "lefthook install"
   }
   ```

6. Replace `https://opik.dev` with your site in `scripts/check-site.mjs` and `scripts/report-field-vitals.mjs`.
7. Set `.kit.yml` to the project's type, architecture, and stack.
8. Add an `AGENTS.md` with the gate command and anything an agent can't find in the code. Add `CLAUDE.md` containing `@AGENTS.md`.
9. Run `pnpm install && pnpm format && pnpm verify`. Fix each finding. In a large codebase, block new violations only.
10. Add your deploy steps after the Lighthouse gate in `.github/workflows/ci.yml`.
11. Break each gate once and confirm it fails.

## Know the limits

- `Stop` hooks can't fail closed, so CI is the final gate.
- The Claude Code hooks don't cover other agents. Git hooks and CI do.
- Field vitals need a `PAGESPEED_API_KEY` repository secret.
