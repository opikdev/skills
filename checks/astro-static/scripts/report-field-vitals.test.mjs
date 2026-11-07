import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarize } from './report-field-vitals.mjs';

test('reports metrics within budget as ok', () => {
  const rows = summarize({
    LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2500 },
    INTERACTION_TO_NEXT_PAINT: { percentile: 200 },
    CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 10 },
  });
  assert.deepEqual(
    rows.map(({ status }) => status),
    ['ok', 'ok', 'ok'],
  );
});

test('flags a metric over budget', () => {
  const [lcp] = summarize({ LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2501 } });
  assert.equal(lcp.status, 'over budget');
  assert.equal(lcp.line, 'LCP: p75 2501ms, budget 2500ms (over budget)');
});

test('reports no data for a low-traffic site', () => {
  assert.deepEqual(
    summarize().map(({ line }) => line),
    ['LCP: no field data', 'INP: no field data', 'CLS: no field data'],
  );
});
