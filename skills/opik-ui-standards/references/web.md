# Public Web Reference

## Performance

Field targets (Google's "good" thresholds at p75 of real users): **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**. CI can't measure field data, so gate on lab LCP, CLS, and Total Blocking Time as the proxy for INP, and build with margin (LCP ~2.0s, INP ~160ms, CLS ~0.08) for mid-range phones.

- **LCP**: server-render the hero, preload the LCP image and critical fonts, inline critical CSS, no lazy-loading above-the-fold images, fast TTFB (CDN/edge, caching headers).
- **INP**: break long main-thread tasks, defer non-critical JS, minimal hydration, no heavy work in event handlers; third-party scripts (analytics, chat) load deferred and are treated as budget spend — question every one.
- **CLS**: explicit width/height on every image, video, iframe, embed, and ad slot; reserve space for dynamic content; `font-display: swap` with size-adjusted fallback fonts.
- **Images**: modern formats (AVIF/WebP), responsive `srcset`/`sizes`, lazy-load below the fold, compressed; never ship a 4000px original.
- **Code**: split by route, tree-shake, no duplicate libraries, audit bundle size on every dependency add.
- **Caching**: immutable hashed assets with long max-age; HTML with sensible revalidation.
- Verify with Lighthouse in CI and a scheduled field report. A low-traffic site may have no field data; report that instead of assuming it passes.

## Technical SEO

- Semantic HTML document: one `<h1>`, landmark elements, valid lang attribute.
- Every indexable page: unique `<title>` (~50–60 chars), meta description (~150–160), self-referencing canonical URL. Canonicals must not change after JS render.
- `robots.txt` (small, deliberate — never blocking CSS/JS) + XML sitemap submitted, containing only canonical, indexable, 200-status URLs.
- Structured data as JSON-LD in the initial HTML for applicable types (Article, Product, FAQPage, BreadcrumbList, Organization) — validated, matching visible content, never fabricated.
- Clean URL design: lowercase, hyphens, meaningful paths, no session/tracking params in canonical URLs. One URL per piece of content; duplicates canonicalized.
- Redirects: 301 for permanent moves, no chains; fix broken internal links.
- Open Graph + Twitter card tags on shareable pages, with a real og:image.
- Internal linking: descriptive anchor text, no orphan pages, breadcrumbs on deep hierarchies.
- Multi-language sites: correct hreflang pairs.

## On-page SEO

- Heading hierarchy mirrors content structure (H1 → H2 → H3, no skips); headings describe the section, written for readers not keyword-stuffing.
- Content-first pages: the primary content is substantial, unique, and above the fold — not buried under hero fluff.
- Descriptive alt text on content images (doubles as accessibility).
- Title/description written to the copy rules: specific, benefit-led, front-loaded — they are the SERP's ad copy.
- Every page targets one clear topic/intent; don't split one topic across near-duplicate pages.

## Accessibility: WCAG 2.2 AA

Extends the accessibility floor in SKILL.md with implementation rules:

- Native HTML first: `<button>`, `<a>`, `<label>`, `<nav>`, `<dialog>` — ARIA only when no native element can do the job, and then correctly (wrong ARIA is worse than none).
- Full keyboard support: every interactive element reachable and operable by keyboard, logical tab order, visible focus, no traps; skip-to-content link.
- Forms: programmatically associated labels, `autocomplete` attributes, errors announced and linked to fields (`aria-describedby`), no placeholder-as-label.
- Images: meaningful alt or `alt=""` for decorative; icon-only buttons get accessible names.
- Motion: respect `prefers-reduced-motion`; no autoplaying media with sound; no flashing content.
- Zoom to 200% and 320px-wide viewports without loss of content or function.
- Announce dynamic updates (live regions) where content changes without navigation.
- Test with keyboard and an automated checker (axe/Lighthouse a11y) minimum; they catch different things.

## Platform hygiene

- HTTPS everywhere; HTTP redirects to HTTPS.
- Security headers: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, HSTS; frame protection unless embedding is intended.
- Responsive, mobile-first: real viewport meta, touch-friendly targets, no horizontal scroll, tested at small widths.
- Custom 404 page (with navigation back) served with a real 404 status; error pages that don't dead-end.
- Favicon + web manifest basics; correct charset and viewport in `<head>`.
- Progressive enhancement mindset: core content readable if JS fails; forms that can degrade gracefully where feasible.
- External links that open new tabs: `rel="noopener"`.
- Don't break the platform: working back button, real links (`<a href>`) for navigation (not div-onclick), scroll restoration, shareable URLs for meaningful states.

## GEO

Light guidance, never a gate. The evidence is much thinner than for SEO, and Google treats optimizing for AI search as SEO.

- Follow the SEO rules above: content in the initial HTML, clear headings, one topic per page.
- Add no AI-only markup for Google. An `llms.txt` is fine for other services, but Search doesn't use it.
- Never stuff content or fabricate claims to win citations.
