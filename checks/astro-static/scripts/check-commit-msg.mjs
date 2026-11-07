import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const subjectPattern =
  /^(feat|fix|refactor|perf|test|docs|chore|style)(\([a-z0-9-]+\))?!?: [^A-Z].*[^.\s]$/;

export function checkMessage(message) {
  const lines = message
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .join('\n')
    .trim()
    .split('\n');
  const [subject, ...rest] = lines;
  const problems = [];
  if (subject.length > 72) {
    problems.push(`GIT-001 subject is ${subject.length} characters, the limit is 72`);
  }
  if (!subjectPattern.test(subject)) {
    problems.push(`GIT-001 subject is not "type(scope): lowercase description": ${subject}`);
  }
  if (rest.length > 0) {
    problems.push('GIT-002 commit has a body or trailers; use a subject line only');
  }
  return problems;
}

function report(label, problems) {
  for (const problem of problems) console.error(`${label}: ${problem}`);
  return problems.length;
}

function checkRange(range) {
  const hashes = execFileSync('git', ['log', '--no-merges', '--format=%H', range], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
  let failures = 0;
  for (const hash of hashes) {
    const message = execFileSync('git', ['log', '-1', '--format=%B', hash], { encoding: 'utf8' });
    failures += report(hash.slice(0, 7), checkMessage(message));
  }
  return failures;
}

if (import.meta.main) {
  const [first, second] = process.argv.slice(2);
  const failures =
    first === '--range'
      ? checkRange(second)
      : report('commit message', checkMessage(readFileSync(first, 'utf8')));
  process.exitCode = failures > 0 ? 1 : 0;
}
