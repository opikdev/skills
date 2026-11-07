import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const notFoundPage = '/404.html';

function title(page) {
  return page.root.querySelector('title')?.text.trim() ?? '';
}

function description(page) {
  return page.root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
}

export function urlForFile(file) {
  if (file === 'index.html') return '/';
  return file.endsWith('/index.html') ? `/${file.slice(0, -'index.html'.length)}` : `/${file}`;
}

function resolveInternal(href, pageUrl, origin) {
  const target = new URL(href, `${origin}${pageUrl}`);
  if (target.origin !== origin) return null;
  return { path: target.pathname, fragment: target.hash.slice(1) };
}

function hasPage(paths, path) {
  return paths.has(path) || paths.has(`${path}/`);
}

function findDuplicates(pages, id, label, read) {
  const firstUrlByValue = new Map();
  const findings = [];
  for (const page of pages) {
    const value = read(page);
    if (!value) continue;
    const first = firstUrlByValue.get(value);
    if (first) {
      findings.push({
        id,
        severity: 'error',
        where: page.url,
        message: `${label} duplicates ${first}: "${value}"`,
      });
    } else {
      firstUrlByValue.set(value, page.url);
    }
  }
  return findings;
}

function findBrokenLinks(page, roots, paths, redirects, origin) {
  const findings = [];
  const references = [
    ...page.root.querySelectorAll('a[href]').map((node) => node.getAttribute('href')),
    ...page.root.querySelectorAll('img[src]').map((node) => node.getAttribute('src')),
  ];
  for (const href of references) {
    if (/^(mailto|tel):/.test(href)) continue;
    const target = resolveInternal(href, page.url, origin);
    if (!target) continue;
    if (!hasPage(paths, target.path) && !redirects.has(target.path)) {
      findings.push({
        id: 'WEB-SEO-006',
        severity: 'error',
        where: page.url,
        message: `broken link: ${href}`,
      });
      continue;
    }
    const targetRoot = roots.get(target.path) ?? roots.get(`${target.path}/`);
    if (target.fragment && targetRoot && !targetRoot.getElementById(target.fragment)) {
      findings.push({
        id: 'WEB-SEO-006',
        severity: 'error',
        where: page.url,
        message: `broken anchor: ${href}`,
      });
    }
  }
  return findings;
}

function jsonLdScripts(page) {
  return page.root.querySelectorAll('script[type="application/ld+json"]');
}

function isValidJson(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function findInvalidJsonLd(page) {
  return jsonLdScripts(page)
    .filter((script) => !isValidJson(script.rawText))
    .map(() => ({
      id: 'WEB-SEO-008',
      severity: 'error',
      where: page.url,
      message: 'JSON-LD is not valid JSON',
    }));
}

export function checkPages({ pages, sitemap, assets = [], redirects = [], origin }) {
  const parsed = pages.map((page) => ({ url: page.url, root: parse(page.html) }));
  const indexable = parsed.filter((page) => page.url !== notFoundPage);
  const roots = new Map(parsed.map((page) => [page.url, page.root]));
  const paths = new Set([...parsed.map((page) => page.url), ...assets]);
  const redirectSources = new Set(redirects);
  const findings = [];

  for (const page of parsed) {
    const h1Count = page.root.querySelectorAll('h1').length;
    if (h1Count !== 1) {
      findings.push({
        id: 'WEB-SEO-001',
        severity: 'error',
        where: page.url,
        message: `expected one <h1>, found ${h1Count}`,
      });
    }
    if (!title(page)) {
      findings.push({
        id: 'WEB-SEO-002',
        severity: 'error',
        where: page.url,
        message: 'missing <title>',
      });
    }
    if (!description(page)) {
      findings.push({
        id: 'WEB-SEO-003',
        severity: 'error',
        where: page.url,
        message: 'missing meta description',
      });
    }
    findings.push(...findBrokenLinks(page, roots, paths, redirectSources, origin));
    findings.push(...findInvalidJsonLd(page));
  }

  findings.push(...findDuplicates(parsed, 'WEB-SEO-002', 'title', title));
  findings.push(...findDuplicates(parsed, 'WEB-SEO-003', 'description', description));

  for (const page of indexable) {
    const canonical = page.root.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const expected = `${origin}${page.url}`;
    if (canonical !== expected) {
      findings.push({
        id: 'WEB-SEO-004',
        severity: 'error',
        where: page.url,
        message: `canonical is ${canonical ?? 'missing'}, expected ${expected}`,
      });
    }
    if (jsonLdScripts(page).length === 0) {
      findings.push({
        id: 'WEB-SEO-007',
        severity: 'warn',
        where: page.url,
        message: 'no JSON-LD',
      });
    }
  }

  const listed = new Set(sitemap);
  for (const page of indexable) {
    if (!listed.has(page.url)) {
      findings.push({
        id: 'WEB-SEO-005',
        severity: 'error',
        where: page.url,
        message: 'page is missing from the sitemap',
      });
    }
  }
  for (const url of listed) {
    if (!indexable.some((page) => page.url === url)) {
      findings.push({
        id: 'WEB-SEO-005',
        severity: 'error',
        where: url,
        message: 'sitemap lists a page that does not exist',
      });
    }
  }
  return findings;
}

export function checkHeaders(headers) {
  const required = ['Content-Security-Policy', 'Strict-Transport-Security'];
  return required
    .filter((name) => !headers.toLowerCase().includes(`${name.toLowerCase()}:`))
    .map((name) => ({
      id: 'WEB-SEC-001',
      severity: 'warn',
      where: 'public/_headers',
      message: `missing ${name}`,
    }));
}

export function checkInlineScripts(pages, headers) {
  if (!/script-src/i.test(headers)) return [];
  return pages.flatMap((page) =>
    parse(page.html)
      .querySelectorAll('script')
      .filter((script) => !script.hasAttribute('src'))
      .filter((script) => script.getAttribute('type') !== 'application/ld+json')
      .map((script) => createHash('sha256').update(script.rawText).digest('base64'))
      .filter((hash) => !headers.includes(`'sha256-${hash}'`))
      .map((hash) => ({
        id: 'WEB-SEC-002',
        severity: 'error',
        where: page.url,
        message: `CSP in public/_headers blocks an inline script; allow 'sha256-${hash}'`,
      })),
  );
}

export function checkWorkflow(file, text) {
  const actions = [...text.matchAll(/^\s*(?:-\s+)?uses:\s*(\S+)/gm)].map((match) => match[1]);
  return actions
    .filter((action) => !action.startsWith('./') && !/@[0-9a-f]{40}$/.test(action))
    .map((action) => ({
      id: 'CI-001',
      severity: 'warn',
      where: file,
      message: `action is not pinned to a commit SHA: ${action}`,
    }));
}

function readRedirectSources(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/)[0]);
}

function readDist(dist, origin) {
  const files = readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(dist.length + 1));
  const pages = files
    .filter((file) => file.endsWith('.html'))
    .map((file) => ({ url: urlForFile(file), html: readFileSync(join(dist, file), 'utf8') }));
  const sitemap = files
    .filter((file) => /^sitemap-\d+\.xml$/.test(file))
    .flatMap((file) =>
      [...readFileSync(join(dist, file), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
        match[1].slice(origin.length),
      ),
    );
  return {
    pages,
    sitemap,
    assets: files.filter((file) => !file.endsWith('.html')).map((file) => `/${file}`),
    redirects: readRedirectSources(readFileSync(join(dist, '_redirects'), 'utf8')),
    origin,
  };
}

if (import.meta.main) {
  const site = readDist('dist', 'https://opik.dev');
  const headers = readFileSync('public/_headers', 'utf8');
  const workflowDir = '.github/workflows';
  const findings = [
    ...checkPages(site),
    ...checkHeaders(headers),
    ...checkInlineScripts(site.pages, headers),
    ...readdirSync(workflowDir).flatMap((file) =>
      checkWorkflow(join(workflowDir, file), readFileSync(join(workflowDir, file), 'utf8')),
    ),
  ];
  for (const { severity, id, where, message } of findings) {
    console.log(`${severity.padEnd(5)} ${id} ${where}: ${message}`);
  }
  const errors = findings.filter((finding) => finding.severity === 'error').length;
  console.log(
    `check-site: ${site.pages.length} pages, ${errors} errors, ${findings.length - errors} warnings`,
  );
  process.exitCode = errors > 0 ? 1 : 0;
}
