---
name: opik-web-standards
description: Standards for building public websites and web apps, enforcing correct rendering strategy, Core Web Vitals performance, technical and on-page SEO, deep web accessibility, and platform hygiene. Use this skill for EVERY web-facing task — building or editing websites, landing pages, web apps, SPAs, SSR/SSG pages; choosing frameworks or rendering strategies; adding pages, routes, meta tags, images, or fonts; or auditing a site for speed, SEO, or accessibility. If output will be served to browsers or indexed by search engines, apply this skill.
---

# Web Standards

Rules for all public-web work. They target the main failure modes: wrong rendering strategy for the page type, JS-bloated slow pages, unindexable client-rendered content, surface-level accessibility, and missing platform hygiene.

## 1. Rendering strategy — decide per page type, first

Choose before building; changing later is expensive.

| Page type | Strategy | Why |
|---|---|---|
| Public content (marketing, blog, docs, product pages) | SSG, or SSR if per-request dynamic | SEO needs full HTML in the initial response; fastest LCP |
| Public + frequently changing (listings, search results) | SSR (or SSG + revalidation) | Indexable and fresh |
| Authenticated app areas (dashboards, tools) | CSR/SPA is fine | No SEO need; interactivity dominates |
| Mixed sites | Hybrid framework (Next/Nuxt/Astro/SvelteKit) — per-route choice | Don't force one mode on everything |

- Anything that must rank must be present in the initial HTML: content, title, meta, canonical, and structured data — not injected client-side after render.
- Error states return correct HTTP status codes server-side (real 404/500), since non-200 pages may be excluded from rendering pipelines entirely — never a 200 "not found" page (soft 404).
- Isolate personalization from indexable content.
- Ship the least JavaScript that does the job: static content needs no framework runtime (Astro islands / RSC / plain HTML beat hydrating everything).

## 2. Performance — Core Web Vitals budgets

Targets (Google's "good" thresholds, measured at p75 real users): **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**. Build to beat them with margin (LCP ~2.0s, INP ~160ms, CLS ~0.08) since field data on mid-range phones is what counts, not local Lighthouse.

- **LCP**: server-render the hero, preload the LCP image and critical fonts, inline critical CSS, no lazy-loading above-the-fold images, fast TTFB (CDN/edge, caching headers).
- **INP**: break long main-thread tasks, defer non-critical JS, minimal hydration, no heavy work in event handlers; third-party scripts (analytics, chat) load deferred and are treated as budget spend — question every one.
- **CLS**: explicit width/height on every image, video, iframe, embed, and ad slot; reserve space for dynamic content; `font-display: swap` with size-adjusted fallback fonts.
- **Images**: modern formats (AVIF/WebP), responsive `srcset`/`sizes`, lazy-load below the fold, compressed; never ship a 4000px original.
- **Code**: split by route, tree-shake, no duplicate libraries, audit bundle size on every dependency add.
- **Caching**: immutable hashed assets with long max-age; HTML with sensible revalidation.
- Verify with real measurement (Lighthouse + field data when available) before declaring done — per coding standards, "done" means proven.

## 3. Technical SEO

- Semantic HTML document: one `<h1>`, landmark elements, valid lang attribute.
- Every indexable page: unique `<title>` (~50–60 chars), meta description (~150–160), self-referencing canonical URL. Canonicals must not change after JS render.
- `robots.txt` (small, deliberate — never blocking CSS/JS) + XML sitemap submitted, containing only canonical, indexable, 200-status URLs.
- Structured data as JSON-LD in the initial HTML for applicable types (Article, Product, FAQPage, BreadcrumbList, Organization) — validated, matching visible content, never fabricated.
- Clean URL design: lowercase, hyphens, meaningful paths, no session/tracking params in canonical URLs. One URL per piece of content; duplicates canonicalized.
- Redirects: 301 for permanent moves, no chains; fix broken internal links.
- Open Graph + Twitter card tags on shareable pages, with a real og:image.
- Internal linking: descriptive anchor text, no orphan pages, breadcrumbs on deep hierarchies.
- Multi-language sites: correct hreflang pairs.

## 4. On-page SEO

- Heading hierarchy mirrors content structure (H1 → H2 → H3, no skips); headings describe the section, written for readers not keyword-stuffing.
- Content-first pages: the primary content is substantial, unique, and above the fold — not buried under hero fluff.
- Descriptive alt text on content images (doubles as accessibility).
- Title/description written per copywriting standards: specific, benefit-led, front-loaded — they are the SERP's ad copy.
- Every page targets one clear topic/intent; don't split one topic across near-duplicate pages.

## 5. Accessibility — WCAG 2.2 AA (web-deep)

Extends the design skill's floor with implementation-level rules:

- Native HTML first: `<button>`, `<a>`, `<label>`, `<nav>`, `<dialog>` — ARIA only when no native element can do the job, and then correctly (wrong ARIA is worse than none).
- Full keyboard support: every interactive element reachable and operable by keyboard, logical tab order, visible focus, no traps; skip-to-content link.
- Forms: programmatically associated labels, `autocomplete` attributes, errors announced and linked to fields (`aria-describedby`), no placeholder-as-label.
- Images: meaningful alt or `alt=""` for decorative; icon-only buttons get accessible names.
- Motion: respect `prefers-reduced-motion`; no autoplaying media with sound; no flashing content.
- Zoom to 200% and 320px-wide viewports without loss of content or function.
- Announce dynamic updates (live regions) where content changes without navigation.
- Test with keyboard and an automated checker (axe/Lighthouse a11y) minimum; they catch different things.

## 6. Platform hygiene

- HTTPS everywhere; HTTP redirects to HTTPS.
- Security headers: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, HSTS; frame protection unless embedding is intended. (Extends coding standards' security section to the HTTP layer.)
- Responsive, mobile-first: real viewport meta, touch-friendly targets, no horizontal scroll, tested at small widths.
- Custom 404 page (with navigation back) served with a real 404 status; error pages that don't dead-end.
- Favicon + web manifest basics; correct charset and viewport in `<head>`.
- Progressive enhancement mindset: core content readable if JS fails; forms that can degrade gracefully where feasible.
- External links that open new tabs: `rel="noopener"`.
- Don't break the platform: working back button, real links (`<a href>`) for navigation (not div-onclick), scroll restoration, shareable URLs for meaningful states.

## Self-check before finishing

1. Right rendering strategy per page — is everything that must rank present in the initial HTML with correct status codes?
2. Would this pass CWV budgets on a mid-range phone — images sized, JS minimal, layout stable?
3. Title, description, canonical, sitemap, structured data — present, unique, valid?
4. Keyboard-only usable, WCAG AA contrast, native elements, reduced motion respected?
5. HTTPS, security headers, real 404s, mobile-tested, working URLs and back button?

If a rule conflicts with an explicit user instruction or project constraints, those win — note the deviation in one line.
