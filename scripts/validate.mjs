import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const severities = new Set(['error', 'warn']);
const requiredFields = ['id', 'severity', 'rule', 'why', 'applies'];
const maxDescription = 1024;

export function validateRules(rules) {
  const problems = [];
  const seen = new Set();
  for (const rule of rules) {
    const label = rule.id ?? JSON.stringify(rule);
    for (const field of requiredFields) {
      if (!rule[field]) problems.push(`${label}: missing ${field}`);
    }
    if (seen.has(rule.id)) problems.push(`${label}: duplicate id`);
    seen.add(rule.id);
    if (!severities.has(rule.severity)) {
      problems.push(`${label}: unknown severity "${rule.severity}"`);
    }
    if (rule.severity === 'error' && !rule.verify?.tool) {
      problems.push(`${label}: an error rule needs a verify method`);
    }
  }
  return problems;
}

export function validateSkill(directory, text, fileExists) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return [`${directory}: missing frontmatter`];
  const { name, description } = parse(match[1]);
  const problems = [];
  if (name !== directory) problems.push(`${directory}: name is "${name}"`);
  if (!description) problems.push(`${directory}: missing description`);
  if (description?.length > maxDescription) {
    problems.push(`${directory}: description is ${description.length} characters`);
  }
  for (const [, target] of text.matchAll(/\]\((references\/[^)]+)\)/g)) {
    if (!fileExists(target)) problems.push(`${directory}: broken link to ${target}`);
  }
  return problems;
}

if (import.meta.main) {
  const rules = readdirSync('rules').flatMap((file) =>
    parse(readFileSync(join('rules', file), 'utf8')),
  );
  const skills = readdirSync('skills');
  const problems = [
    ...validateRules(rules),
    ...skills.flatMap((directory) =>
      validateSkill(directory, readFileSync(join('skills', directory, 'SKILL.md'), 'utf8'), (target) =>
        existsSync(join('skills', directory, target)),
      ),
    ),
  ];
  for (const problem of problems) console.error(problem);
  console.log(`validate: ${rules.length} rules, ${skills.length} skills, ${problems.length} problems`);
  process.exitCode = problems.length > 0 ? 1 : 0;
}
