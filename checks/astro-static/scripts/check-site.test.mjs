import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkHeaders, checkPages, checkWorkflow, urlForFile } from './check-site.mjs';

const origin = 'https://example.dev';

function page(url, overrides = {}) {
  const {
    title = `Title ${url}`,
    description = `Description ${url}`,
    canonical = `${origin}${url}`,
    body = '<h1>Heading</h1>',
    jsonLd = true,
  } = overrides;
  return {
    url,
    html: `<html><head>
      <title>${title}</title>
      <meta name="description" content="${description}">
      ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
      ${jsonLd ? '<script type="application/ld+json">{}</script>' : ''}
    </head><body>${body}</body></html>`,
  };
}

function check(pages, options = {}) {
  const sitemap = pages.map(({ url }) => url).filter((url) => url !== '/404.html');
  return checkPages({ pages, sitemap, origin, ...options });
}

function ids(findings) {
  return findings.map(({ id, severity }) => `${severity}:${id}`);
}

test('a complete site has no findings', () => {
  const pages = [
    page('/', { body: '<h1>Home</h1><a href="/work/">Work</a><a href="mailto:a@b.dev">Mail</a>' }),
    page('/work/', { body: '<h1>Work</h1><a href="https://other.dev/x">Out</a>' }),
  ];
  assert.deepEqual(check(pages), []);
});

test('maps dist files to urls', () => {
  assert.equal(urlForFile('index.html'), '/');
  assert.equal(urlForFile('work/orbit/index.html'), '/work/orbit/');
  assert.equal(urlForFile('404.html'), '/404.html');
});

test('flags a page without exactly one h1', () => {
  assert.deepEqual(ids(check([page('/', { body: '<p>none</p>' })])), ['error:WEB-SEO-001']);
  assert.deepEqual(ids(check([page('/', { body: '<h1>a</h1><h1>b</h1>' })])), [
    'error:WEB-SEO-001',
  ]);
});

test('flags a missing title and description', () => {
  assert.deepEqual(ids(check([page('/', { title: '', description: '' })])), [
    'error:WEB-SEO-002',
    'error:WEB-SEO-003',
  ]);
});

test('flags a duplicated title and description', () => {
  const pages = [
    page('/a/', { title: 'Same', description: 'Same text' }),
    page('/b/', { title: 'Same', description: 'Same text' }),
  ];
  const findings = check(pages);
  assert.deepEqual(ids(findings), ['error:WEB-SEO-002', 'error:WEB-SEO-003']);
  assert.equal(findings[0].where, '/b/');
});

test('flags a missing or wrong canonical', () => {
  assert.deepEqual(ids(check([page('/', { canonical: '' })])), ['error:WEB-SEO-004']);
  assert.deepEqual(ids(check([page('/', { canonical: 'https://example.dev/other/' })])), [
    'error:WEB-SEO-004',
  ]);
});

test('the 404 page needs no canonical, JSON-LD, or sitemap entry', () => {
  assert.deepEqual(check([page('/404.html', { canonical: '', jsonLd: false })]), []);
});

test('flags sitemap drift in both directions', () => {
  const unlisted = check([page('/')], { sitemap: [] });
  assert.deepEqual(ids(unlisted), ['error:WEB-SEO-005']);
  const stale = check([page('/')], { sitemap: ['/', '/gone/'] });
  assert.deepEqual(ids(stale), ['error:WEB-SEO-005']);
  assert.equal(stale[0].where, '/gone/');
});

test('flags broken links and images', () => {
  const body = '<h1>x</h1><a href="/missing/">a</a><img src="/missing.png" alt="">';
  assert.deepEqual(ids(check([page('/', { body })])), ['error:WEB-SEO-006', 'error:WEB-SEO-006']);
});

test('accepts links to assets, redirects, and pages without a trailing slash', () => {
  const body = '<h1>x</h1><a href="/cv.pdf">a</a><a href="/blog">b</a><a href="/work">c</a>';
  const pages = [page('/', { body }), page('/work/')];
  assert.deepEqual(check(pages, { assets: ['/cv.pdf'], redirects: ['/blog'] }), []);
});

test('flags a broken anchor and accepts a real one', () => {
  const broken = '<h1>x</h1><a href="#nope">a</a>';
  assert.deepEqual(ids(check([page('/', { body: broken })])), ['error:WEB-SEO-006']);
  const valid = '<h1 id="top">x</h1><a href="#top">a</a>';
  assert.deepEqual(check([page('/', { body: valid })]), []);
});

test('missing JSON-LD is a warning, not an error', () => {
  assert.deepEqual(ids(check([page('/', { jsonLd: false })])), ['warn:WEB-SEO-007']);
});

test('warns on each missing security header', () => {
  assert.deepEqual(ids(checkHeaders('/*\n  X-Frame-Options: DENY\n')), [
    'warn:WEB-SEC-001',
    'warn:WEB-SEC-001',
  ]);
  const complete = '/*\n  Content-Security-Policy: x\n  Strict-Transport-Security: y\n';
  assert.deepEqual(checkHeaders(complete), []);
});

test('warns on actions that are not pinned to a SHA', () => {
  const pinned = 'uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1';
  assert.deepEqual(checkWorkflow('ci.yml', `      - ${pinned}\n      - uses: ./local\n`), []);
  assert.deepEqual(ids(checkWorkflow('ci.yml', '      - uses: actions/checkout@v7\n')), [
    'warn:CI-001',
  ]);
});
