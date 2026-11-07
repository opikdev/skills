import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateRuleReferences, validateRules, validateSkill } from './validate.mjs';

const rule = {
  id: 'WEB-PERF-002',
  severity: 'error',
  rule: 'LCP is 2.5s or less in the lab',
  why: 'Early proxy',
  applies: { type: 'web-app' },
  verify: { tool: 'lighthouse' },
};

function skill(frontmatter, body = '') {
  return `---\n${frontmatter}\n---\n${body}`;
}

test('accepts a complete rule', () => {
  assert.deepEqual(validateRules([rule]), []);
});

test('rejects an error rule without a verify method', () => {
  const { verify, ...unverified } = rule;
  assert.deepEqual(validateRules([unverified]), [
    'WEB-PERF-002: an error rule needs a verify method',
  ]);
});

test('allows a warn rule without a verify method', () => {
  const { verify, ...guidance } = rule;
  assert.deepEqual(validateRules([{ ...guidance, severity: 'warn' }]), []);
});

test('rejects duplicate ids, missing fields, and unknown severities', () => {
  assert.deepEqual(validateRules([rule, rule]), ['WEB-PERF-002: duplicate id']);
  assert.deepEqual(validateRules([{ ...rule, why: undefined }]), ['WEB-PERF-002: missing why']);
  assert.match(validateRules([{ ...rule, severity: 'block' }])[0], /unknown severity "block"/);
});

test('accepts checks that use registered rule ids', () => {
  const files = [{ path: 'check.mjs', text: "id: 'WEB-PERF-002', again WEB-PERF-002" }];
  assert.deepEqual(validateRuleReferences(files, [rule]), []);
});

test('rejects a check that uses an unregistered rule id', () => {
  const files = [{ path: 'check.mjs', text: "id: 'WEB-SEC-009'" }];
  assert.deepEqual(validateRuleReferences(files, [rule]), [
    'check.mjs: WEB-SEC-009 is not in rules/',
  ]);
});

test('does not read a rule id inside a longer id', () => {
  const known = [{ ...rule, id: 'WEB-SEC-001' }];
  const files = [{ path: 'check.mjs', text: 'WEB-SEC-001' }];
  assert.deepEqual(validateRuleReferences(files, known), []);
});

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
