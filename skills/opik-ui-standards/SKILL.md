---
name: "opik-ui-standards"
description: "UI standards for visual design, product copy, and public web pages — design brief, anti-\"AI slop\" bans, token system, accessibility floor, microcopy and error-message rules, and rendering/SEO for pages that must rank. Use for EVERY task that designs, builds, styles, writes copy for, or reviews a screen, component, mockup, dashboard, landing page, website, or product email — in Figma, Pencil, Paper, or UI code."
license: "MIT"
---

# UI Standards

## 1. Brief first

Before any pixel or word, one line: purpose, audience, platform, and one adjective for the feel ("calm", "dense", "playful"). If the request lacks these, infer and state them. Every later choice traces back to the brief.

## 2. No AI slop

Banned as defaults:

- **Visual**: Inter + purple-blue gradient on white; cream + terracotta; near-black + acid green; glassmorphism, floating blobs, hero-centered everything; identical rounded card grids for every content type.
- **Words**: unlock, seamless, empower, elevate, supercharge, effortless, revolutionize; "Welcome aboard! 🎉"; "Oops!"; vague hype ("the best way to…"); titles with no information ("Almost there!").

Instead, commit to one signature element — a type choice, a layout idea, an ownable color, a motif. Test before finishing: would this stand out next to ten AI-generated screens?

## 3. Tokens

- Existing tokens, styles, and components win. Add a named token only for a real gap.
- New systems: 4–6 semantic colors (primary, surface, on-surface, error, success); spacing on a 4/8px scale; 2–3 radii and 2–3 shadows; type sizes from a ~1.2–1.333 ratio; max 2 typefaces. Dark mode uses desaturated tonal variants, not inversion.
- In code, tokens become CSS variables or theme values — never inline hex or px.

## 4. Layout and consistency

- One focal point per screen, at most 3 levels of emphasis, everything on the grid. Group with spacing before borders and boxes.
- Body text ~65ch, line-height ~1.5; tabular figures for numbers in columns; wrap before truncating.
- Same action, same look, same position on every screen. Reuse components; never draw a near-duplicate variant.

## 5. Accessibility floor

Overrides aesthetics.

- Contrast ≥4.5:1 (3:1 for large text) — measured, not eyeballed.
- Never color, icon, or emoji alone to carry meaning.
- Targets ≥44px on mobile, ≥24px on desktop; visible focus on everything interactive.
- Native elements before ARIA; full keyboard operation; respect `prefers-reduced-motion`.
- Every field has a real label (no placeholder-as-label); body text ≥16px on mobile.

## 6. Every state, designed and written

- Empty (guides to the first action), loading, error, success — no dead ends.
- Stress-test with realistic content: long names, missing images, 0 and 10,000 items. No lorem ipsum.
- Key components show default, hover, pressed, and disabled.

## 7. Copy

- Write for the reader's goal in plain words; no internal jargon in the UI. Front-load the key word, cut words that don't change meaning, sentence case.
- Buttons are specific verbs ("Delete project", "Send invoice"), never OK/Submit/Yes, and must match what actually happens. Destructive confirmations: verbs on both buttons plus the consequence.
- Errors: what happened → why, if known → how to fix. Never blame the user; never a bare code or "Something went wrong" without a next step.
- One term per concept across the product.
- Marketing: benefit before feature, one CTA per view, specific claims over superlatives. Never invent numbers or testimonials — mark placeholders.
- An existing voice or style guide wins.

## 8. Public web pages

For pages that must rank or be shared:

- Rendering per page type: public content → SSG/SSR; authenticated app → CSR is fine; mixed → per-route hybrid.
- Main content, `<title>`, meta description, canonical, and JSON-LD are in the initial HTML — never injected after render.
- Real HTTP status codes from the server: true 404s, no soft 404s.
- Ship the least JS that does the job; explicit width/height on media; AVIF/WebP with `srcset`.
- Lab budgets before calling it done: LCP ≤2.5s, CLS ≤0.1, and Total Blocking Time ≤200ms as the proxy for INP, which a Lighthouse page load can't measure.
- Field budgets at p75 of real users, when data exists: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- Deeper rules: performance, technical SEO, WCAG 2.2 AA, platform hygiene, and GEO are in [references/web.md](references/web.md). Read it when building or auditing a public page.

## 9. Design tools

- Pencil: load its guidelines before the first edit; follow the file's variables and components.
- Paper: read existing structure and computed styles before editing; reuse frames.
- Figma: use the file's styles, variables, and components; auto-layout; no detached fills.
- Any tool: meaningful layer names (no "Frame 4271"), no orphaned layers.

## Self-check

1. Traces to the brief, with one signature element and zero banned patterns?
2. Every value from a token; contrast measured; all states designed and written?
3. Public page: rankable content in the initial HTML, real status codes, vitals measured?

If a rule conflicts with an explicit user instruction or an established brand guideline, those win — note the deviation in one line.
