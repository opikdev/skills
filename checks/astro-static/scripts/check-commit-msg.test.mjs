import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkMessage } from './check-commit-msg.mjs';

test('accepts conventional subjects', () => {
  for (const message of [
    'docs: say ci deploys published work\n',
    'feat(api)!: rename user_id to id\n',
    'fix(auth): handle expired refresh tokens',
  ]) {
    assert.deepEqual(checkMessage(message), []);
  }
});

test('ignores comment lines left by git', () => {
  assert.deepEqual(checkMessage('chore: bump deps\n# Please enter the message\n#\n'), []);
});

test('rejects subjects outside the format', () => {
  for (const message of [
    'update readme',
    'wip: update readme',
    'docs: Update readme',
    'docs: update readme.',
    'docs:update readme',
    '',
  ]) {
    assert.match(checkMessage(message)[0], /^GIT-001/);
  }
});

test('rejects a subject over 72 characters', () => {
  const problems = checkMessage(`docs: ${'a'.repeat(67)}`);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /73 characters/);
  assert.deepEqual(checkMessage(`docs: ${'a'.repeat(66)}`), []);
});

test('rejects a body and trailers', () => {
  const withTrailer = 'docs: note\n\nCo-Authored-By: Claude <noreply@anthropic.com>\n';
  assert.deepEqual(checkMessage(withTrailer), [
    'GIT-002 commit has a body or trailers; use a subject line only',
  ]);
  assert.match(checkMessage('docs: note\n\nExplains why.')[0], /^GIT-002/);
});
