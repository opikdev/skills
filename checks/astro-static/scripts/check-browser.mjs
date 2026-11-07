import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright-core';
import { urlForFile } from './check-site.mjs';

const port = 4329;
const origin = `http://localhost:${port}`;
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const colorSchemes = ['light', 'dark'];
const startupAttempts = 150;

function listPages() {
  return readdirSync('dist', { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => urlForFile(`${entry.parentPath}/${entry.name}`.slice('dist/'.length)));
}

// The poll must run in sequence, so each attempt waits for the last.
/* oxlint-disable no-await-in-loop */
async function waitForServer() {
  for (let attempt = 0; attempt < startupAttempts; attempt += 1) {
    const ready = await fetch(origin).then(
      (response) => response.ok,
      () => false,
    );
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Preview server did not start at ${origin}`);
}
/* oxlint-enable no-await-in-loop */

async function scan(browser, url, colorScheme) {
  const context = await browser.newContext({ colorScheme });
  const page = await context.newPage();
  const blocked = [];
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy')) blocked.push(message.text());
  });
  await page.goto(`${origin}${url}`);
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  await context.close();
  return { violations, blocked };
}

// Wrangler serves public/_headers as production does; astro preview ignores them.
const server = spawn('pnpm', ['exec', 'wrangler', 'dev', '--local', '--port', String(port)], {
  stdio: 'ignore',
  detached: true,
});

try {
  await waitForServer();
  const browser = await chromium.launch({ channel: 'chrome' });
  const pages = listPages();
  const scans = pages.flatMap((url) =>
    colorSchemes.map(async (colorScheme) => ({
      url,
      colorScheme,
      ...(await scan(browser, url, colorScheme)),
    })),
  );
  let failures = 0;
  for (const { url, colorScheme, violations, blocked } of await Promise.all(scans)) {
    failures += violations.length + blocked.length;
    for (const violation of violations) {
      console.log(`error WEB-A11Y-001 ${url} (${colorScheme}): ${violation.help}`);
      for (const node of violation.nodes) console.log(`  ${node.target.join(' ')}`);
    }
    for (const message of blocked) console.log(`error WEB-SEC-003 ${url}: ${message}`);
  }
  await browser.close();
  console.log(`check-browser: ${pages.length} pages, ${failures} violations`);
  process.exitCode = failures > 0 ? 1 : 0;
} finally {
  process.kill(-server.pid);
}
