import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateSkill } from './validate.mjs';

function skill(frontmatter, body = '') {
  return `---\n${frontmatter}\n---\n${body}`;
}

test('accepts a valid skill', () => {
  const text = skill('name: "a-skill"\ndescription: "Does a thing"', '[x](references/x.md)');
  assert.deepEqual(validateSkill('a-skill', text, () => true), []);
});

test('rejects a skill whose name does not match its directory', () => {
  const text = skill('name: "other"\ndescription: "Does a thing"');
  assert.deepEqual(validateSkill('a-skill', text, () => true), ['a-skill: name is "other"']);
});

test('rejects a skill with no frontmatter, no description, or a long description', () => {
  assert.deepEqual(validateSkill('a-skill', 'no frontmatter', () => true), [
    'a-skill: missing frontmatter',
  ]);
  assert.deepEqual(validateSkill('a-skill', skill('name: a-skill'), () => true), [
    'a-skill: missing description',
  ]);
  const long = skill(`name: a-skill\ndescription: ${'x'.repeat(1025)}`);
  assert.deepEqual(validateSkill('a-skill', long, () => true), [
    'a-skill: description is 1025 characters',
  ]);
});

test('rejects a broken reference link', () => {
  const text = skill('name: a-skill\ndescription: Does a thing', '[x](references/gone.md)');
  assert.deepEqual(validateSkill('a-skill', text, () => false), [
    'a-skill: broken link to references/gone.md',
  ]);
});
