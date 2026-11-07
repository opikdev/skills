const pageUrl = 'https://opik.dev/';
const budgets = {
  LARGEST_CONTENTFUL_PAINT_MS: { label: 'LCP', max: 2500, unit: 'ms' },
  INTERACTION_TO_NEXT_PAINT: { label: 'INP', max: 200, unit: 'ms' },
  CUMULATIVE_LAYOUT_SHIFT_SCORE: { label: 'CLS', max: 10, unit: '/100' },
};

export function summarize(metrics = {}) {
  return Object.entries(budgets).map(([key, { label, max, unit }]) => {
    const value = metrics[key]?.percentile;
    if (value === undefined) return { label, status: 'no data', line: `${label}: no field data` };
    const status = value > max ? 'over budget' : 'ok';
    return {
      label,
      status,
      line: `${label}: p75 ${value}${unit}, budget ${max}${unit} (${status})`,
    };
  });
}

async function fetchMetrics(key) {
  const params = new URLSearchParams({ url: pageUrl, strategy: 'mobile', key });
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
  );
  if (!response.ok) throw new Error(`PageSpeed API returned ${response.status} for ${pageUrl}`);
  const report = await response.json();
  return report.loadingExperience?.metrics;
}

if (import.meta.main) {
  const key = process.env.PAGESPEED_API_KEY;
  if (key) {
    const rows = summarize(await fetchMetrics(key));
    for (const { status, line } of rows) {
      console.log(status === 'ok' ? line : `::warning::WEB-PERF-004 ${line}`);
    }
  } else {
    console.log(
      '::warning::WEB-PERF-004 PAGESPEED_API_KEY is not set, so field vitals were skipped',
    );
  }
}
