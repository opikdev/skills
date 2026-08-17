---
name: opik-design-standards
description: UI/UX design standards enforcing deliberate, non-generic, token-driven, accessible design. Use this skill for EVERY design task — designing screens, components, mockups, prototypes, landing pages, dashboards, or design reviews — in any design tool (Figma, Pencil/pen.dev, Paper/paper.design) or when generating UI code with visual decisions. If anything visual is being designed, styled, or reviewed, apply this skill.
---

# Design Standards

Rules for how all UI/UX design work must be done. They target the main AI-design failure modes: generic "AI slop" aesthetics, token-less one-off values, inconsistency across screens, inaccessible output, and happy-path-only design.

## 1. Design brief before pixels

Never start designing without a one-paragraph brief. State: purpose (what job this screen does), audience, platform (mobile/desktop/both), and one adjective for the intended feel ("calm", "dense", "playful", "authoritative"). If the request doesn't contain these, infer and state your assumption in one line, or ask. Every later decision must be justifiable against this brief — no brief means generic output.

## 2. Anti-generic mandate

AI-generated design converges on statistical clichés. These are banned as defaults:

- Inter/generic sans + purple-blue gradient on white
- Warm cream + terracotta "tasteful" palette
- Near-black + acid green "techno" palette
- Glassmorphism, floating blobs, and hero-centered-everything layouts
- Identical rounded-corner card grids for every content type

Instead, make one deliberate signature element per design — a distinctive type choice, a structural layout idea, an ownable color, a recurring motif — and commit to it. Before finalizing, self-critique: "would this be recognizable next to ten AI-generated screens?" If not, revise. Deliberate and simple beats decorated and generic.

## 3. Token system first

Define the design system before drawing any screen. Design decisions are named tokens, not one-off values:

- **Color**: 4–6 colors max, semantic roles (primary, surface, on-surface, error, success) — never raw hex sprinkled per-element. Dark mode uses desaturated tonal variants, not inverted colors.
- **Spacing**: one scale on a 4px or 8px grid (e.g., 4/8/12/16/24/32/48/64). Every margin, padding, and gap comes from the scale. No 13px, no 27px.
- **Radius & elevation**: 2–3 radius values, 2–3 shadow levels. Consistent everywhere.
- **Type scale**: defined sizes from a ratio (see §4).

If a design file or project already has tokens/styles, use those — never introduce parallel values. Extend the existing system only when a genuine gap exists, and name the new token.

## 4. Typography discipline

- Max 2 typefaces (one is often enough: one family, multiple weights).
- Sizes from a modular scale (~1.2–1.333 ratio), not arbitrary values.
- Weight reinforces hierarchy: headings 600–700, body 400, labels/UI 500.
- Body text: 45–75 characters per line (~65ch ideal), line-height ~1.5 for body, tighter (~1.2) for headings.
- Default letter-spacing for body; never tight tracking on small text.
- Tabular figures for numbers in columns, prices, timers.
- Prefer wrapping over truncation; if truncating, ellipsis + a way to see full text.

## 5. Hierarchy and layout

- One clear focal point per screen — the user's eye must know where to go first. At most 3 competing levels of visual emphasis.
- Everything aligns to a grid; no optically "close enough" placement.
- Whitespace is a design element: generous, consistent, from the spacing scale. Cramped ≠ efficient.
- Proximity groups related things; separation implies unrelatedness. Use spacing for grouping before reaching for borders and boxes.
- Size, weight, and color signal importance — decoration doesn't.

## 6. Consistency across screens

- Same action, same appearance, same position — everywhere. A primary button on screen 1 is identical on screen 12.
- Reuse components; never redraw a variant of an existing component with slightly different padding or color.
- Interaction patterns stay uniform: navigation placement, form layouts, feedback style.
- When adding screens to an existing design, audit against existing screens for drift before finishing.

## 7. Accessibility floor (non-negotiable)

- Text contrast ≥ 4.5:1 against its background (3:1 for large text). Verify, don't eyeball.
- Never color-only meaning: error/success/status must pair color with icon or text.
- Touch targets ≥ 44×44px (mobile) / clickable areas ≥ 24px with spacing (desktop).
- Visible focus states for every interactive element.
- Real text, never text baked into images. Minimum body size 16px mobile / 14px desktop.
- These override aesthetics: a beautiful design that fails contrast is a failed design.

## 8. Design the UX, not just the happy screen

- Every flow includes: empty state, loading state, error state, and success feedback.
- Stress-test with realistic content: long names, missing avatars, zero items, 10,000 items, overflow text. If it breaks with real data, it's not done.
- Use realistic placeholder content ("Ahmad Fauzi — Paid — Rp 1.250.000"), never lorem ipsum — real content exposes layout problems lorem hides.
- Forms: label every field (no placeholder-as-label), inline validation, clear primary action, obvious error recovery.
- Show interactive states on key components: default, hover, pressed, disabled.

## 9. Tool conduct

- **Pencil / pen.dev**: load the tool's built-in guidelines (`get_guidelines`) before the first edit; follow the existing .pen file's variables/tokens and component structure.
- **Paper (paper.design)**: the canvas is real HTML/CSS — read the existing file's structure and computed styles before editing; express tokens as CSS values consistently (flex layouts, gap/padding from the spacing scale); reuse existing frames/components instead of drawing parallel ones.
- **Figma**: use existing styles, variables, and components from the file or library — never detached one-off fills and text styles. Use auto-layout, name layers/frames meaningfully, organize pages logically.
- **Any tool**: keep the file as organized as the design — clear names, no "Frame 4271", no orphaned layers, deleted experiments actually deleted.
- When generating UI code from a design, carry tokens over as CSS variables / theme values — never hardcode the values inline.

## Self-check before finishing

1. Does every decision trace to the brief, and is there one deliberate signature element?
2. Would this pass the "not AI slop" test next to ten generic outputs?
3. Is every value (color, space, size, radius) from a named token/scale?
4. Contrast verified, color never sole carrier of meaning, targets big enough?
5. Are empty/loading/error states and realistic-content stress tests done?
6. Is the file itself organized — named layers, reused components, no drift?

If a rule conflicts with an explicit user instruction or an established brand guideline, those win — note the deviation in one line.
