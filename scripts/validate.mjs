import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const maxDescription = 1024;

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
  const skills = readdirSync('skills');
  const problems = skills.flatMap((directory) =>
    validateSkill(directory, readFileSync(join('skills', directory, 'SKILL.md'), 'utf8'), (target) =>
      existsSync(join('skills', directory, target)),
    ),
  );
  for (const problem of problems) console.error(problem);
  console.log(`validate: ${skills.length} skills, ${problems.length} problems`);
  process.exitCode = problems.length > 0 ? 1 : 0;
}
