import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readToolUses, score, skillFromToolUse } from './trigger-eval.mjs';

test('reads tool uses from assistant events only', () => {
  const toolUse = { type: 'tool_use', name: 'Read', input: {} };
  const event = { type: 'assistant', message: { content: [{ type: 'text' }, toolUse] } };
  assert.deepEqual(readToolUses(event), [toolUse]);
  assert.deepEqual(readToolUses({ type: 'result' }), []);
});

test('finds the skill named in a Skill tool use', () => {
  const toolUse = { name: 'Skill', input: { skill: 'opik-git-standards' } };
  assert.equal(skillFromToolUse(toolUse), 'git');
  const namespaced = { name: 'Skill', input: { skill: 'plugin:opik-ui-standards' } };
  assert.equal(skillFromToolUse(namespaced), 'ui');
});

test('ignores other tools and unrelated skills', () => {
  assert.equal(skillFromToolUse({ name: 'Read', input: { file: 'opik-git-standards' } }), null);
  assert.equal(skillFromToolUse({ name: 'Skill', input: { skill: 'dataviz' } }), null);
});

test('counts loads and misses for expected skills', () => {
  const cases = [{ prompt: 'commit this', must: ['git'], may: [] }];
  const git = score(cases, [[['git'], []]]).find(({ skill }) => skill === 'git');
  assert.equal(git.loaded, 1);
  assert.equal(git.expected, 2);
  assert.deepEqual(git.missed, ['commit this']);
});

test('counts a false load only when the skill is not allowed', () => {
  const cases = [
    { prompt: 'review this', must: ['review'], may: ['coding'] },
    { prompt: 'what is a mutex', must: [], may: [] },
  ];
  const rows = score(cases, [[['review', 'coding']], [['coding']]]);
  const coding = rows.find(({ skill }) => skill === 'coding');
  assert.equal(coding.falseLoads, 1);
  assert.deepEqual(coding.extra, ['what is a mutex']);
});
