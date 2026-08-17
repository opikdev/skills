---
name: opik-copywriting-standards
description: Copywriting standards enforcing clear, user-centered, non-generic product copy. Use this skill for EVERY writing task involving product or marketing text — UI microcopy (buttons, labels, error messages, empty states, tooltips, notifications, onboarding), landing pages, emails, app store text, or copy reviews — including when copy is written inside designs or code. If words that users will read are being written or changed, apply this skill.
---

# Copywriting Standards

Rules for all product and marketing copy. They target the main AI-copy failure modes: business-first phrasing, generic filler-speak, vague buttons, useless error messages, and inconsistent voice.

## 1. User's words, user's goal

Write for what the reader is trying to do — never for the business. "See what's new" beats "We have updated our policy". Plain language always: no jargon, no internal terminology leaking into the UI ("sync conflict resolution engine" → "couldn't save your changes"). If a 12-year-old couldn't follow it, rewrite it.

## 2. Anti-generic mandate

AI copy converges on the same filler-speak. Banned as defaults:

- "Unlock", "Seamless", "Empower", "Elevate", "Supercharge", "Effortless", "Revolutionize"
- "Welcome aboard! 🎉" onboarding-speak and excessive "Oops!" in errors
- Vague hype ("the best way to...") instead of a concrete claim
- Cutesy titles that carry no information ("Almost there!", "Attention")

Clarity beats personality — in high-stakes or high-friction moments (errors, payments, deletion), understanding always wins over brand voice. Personality is a seasoning, not the dish.

## 3. Buttons and labels

- Actions are verbs, specific to the outcome: "Delete project", "Save changes", "Send invoice" — never bare "OK", "Submit", "Yes".
- The label must accurately say what happens next; if clicking "Save" also publishes, the label lies.
- Never write copy that explains how to use its own element ("Click this button to...").
- Destructive confirmations: explicit verbs on both options ("Delete project" / "Keep project"), consequences stated plainly.
- Toggles: label must make clear what ON means; if the reader has to think, rewrite.

## 4. Error messages

The trust-critical moment. Every error message answers, in order:
1. **What** went wrong ("Couldn't upload photo")
2. **Why**, if known ("File is larger than 10 MB")
3. **How to fix** ("Choose a smaller file or compress it")

- Never blame the user ("You entered an invalid..." → "Enter an email like name@example.com").
- Never raw codes or vague catch-alls alone ("Error 500", "Something went wrong") — if a generic fallback is unavoidable, add a next step ("Try again, or contact support").
- No joky apologies on serious failures; calm and practical.

## 5. Every state has copy

(Pairs with the design skill's states rule.)

- **Empty states** guide to action: "No projects yet" + "Create your first project" — never a dead end.
- **Confirmations** state what happened + what's next: "Application submitted. We'll email you within 24 hours."
- **Helper text** prevents errors before they happen and sits next to its field; format hints shown upfront ("8+ characters"), not revealed only after failure.
- **Loading**: say what's happening if it takes more than a moment.
- Modals: razor-sharp — one question, explicit consequences, explicit action buttons.

## 6. Compact and scannable

- One copy item = one idea. One entity = one term across the entire product (pick "workspace" or "project" — never both for the same thing; keep a terminology glossary).
- Front-load the key word: "Delete 3 files?" not "Are you sure that you would like to delete these 3 files?"
- Cut every word that doesn't change meaning. Excessive politeness that buries meaning is a bug.
- Avoid negatives and double negatives ("don't uncheck..."); state things positively.
- Sentence case for UI text unless the platform convention says otherwise.

## 7. Consistent voice, adaptive tone

- Define the product's voice in 3 adjectives before writing anything (e.g., "clear, warm, direct"). Every line must sound like the same product.
- Voice stays constant; tone adapts to the user's emotional state: light on success, calm and practical on errors, neutral and unambiguous on destructive or payment actions.
- If the project has an existing voice/style guide or established copy, match it — consistency beats personal preference.

## 8. Marketing copy (landing pages, emails, app store)

- Lead with the reader's benefit, not the feature: "Ship designs in half the time" before "AI-powered canvas".
- One message per section; one clear CTA per view — competing CTAs cancel each other.
- Specific claims over superlatives: "saves 3 hours per week" beats "revolutionary productivity".
- Headlines must work standalone — most readers read nothing else.
- Emails: subject states the point, first line earns the second, one purpose per email.
- Never invent numbers, testimonials, or claims — mark placeholders clearly for the user to fill.

## 9. Accessibility

- Never meaning through color, emoji, or icon alone — pair with text.
- Alt text for meaningful images; skip decorative ones (`alt=""`).
- Readable at a glance: short lines, no ALL-CAPS sentences, no walls of text in UI.
- Idioms and wordplay travel badly — avoid them if the product will be localized.

## Self-check before finishing

1. Is every line written from the reader's goal, in plain language?
2. Would this copy pass the "not AI slop" test — zero banned filler words?
3. Do all buttons say exactly what happens; do all errors say what/why/how-to-fix?
4. Same term for the same thing everywhere; consistent voice, right tone for the moment?
5. Empty, error, success, and loading states all written — no dead ends?

If a rule conflicts with an explicit user instruction or an established brand/style guide, those win — note the deviation in one line.
