import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline';

const skillNames = ['coding', 'backend', 'ui', 'docs', 'git', 'review'];
const blockedTools = ['Edit', 'Write', 'NotebookEdit', 'Bash', 'Agent', 'Task', 'WebSearch', 'WebFetch'];
const maxOtherTools = 3;
const timeoutMs = 70_000;
const workers = 4;

export function readToolUses(event) {
  if (event.type !== 'assistant') return [];
  return event.message.content.filter((block) => block.type === 'tool_use');
}

export function skillFromToolUse(toolUse) {
  if (toolUse.name !== 'Skill') return null;
  return JSON.stringify(toolUse.input).match(/opik-(\w+)-standards/)?.[1] ?? null;
}

export function score(cases, results) {
  return skillNames.map((skill) => {
    const row = { skill, loaded: 0, expected: 0, falseLoads: 0, missed: [], extra: [] };
    for (const [index, { prompt, must, may }] of cases.entries()) {
      for (const loaded of results[index]) {
        const didLoad = loaded.includes(skill);
        if (must.includes(skill)) {
          row.expected += 1;
          if (didLoad) row.loaded += 1;
          else row.missed.push(prompt);
        } else if (didLoad && !may.includes(skill)) {
          row.falseLoads += 1;
          row.extra.push(prompt);
        }
      }
    }
    return row;
  });
}

function runPrompt(prompt, project, model) {
  const args = [
    '-p',
    prompt,
    '--model',
    model,
    '--settings',
    JSON.stringify({ syncClaudeAiSkills: false }),
    '--no-session-persistence',
    '--output-format',
    'stream-json',
    '--verbose',
    '--disallowedTools',
    ...blockedTools,
  ];
  const { CLAUDECODE: _nested, ...env } = process.env;
  const child = spawn('claude', args, { cwd: project, env, stdio: ['ignore', 'pipe', 'ignore'] });
  const loaded = new Set();
  let otherTools = 0;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => child.kill(), timeoutMs);
    const lines = createInterface({ input: child.stdout });
    lines.on('line', (line) => {
      const event = JSON.parse(line);
      for (const toolUse of readToolUses(event)) {
        const skill = skillFromToolUse(toolUse);
        if (skill) loaded.add(skill);
        if (toolUse.name !== 'Skill') otherTools += 1;
      }
      if (event.type === 'result' || otherTools >= maxOtherTools) child.kill();
    });
    child.on('error', reject);
    child.on('close', () => {
      clearTimeout(timer);
      resolve([...loaded]);
    });
  });
}

async function runAll(cases, project, model, runs) {
  const results = cases.map(() => []);
  const queue = cases.flatMap((_, index) => Array.from({ length: runs }, () => index));
  const worker = async () => {
    for (let index = queue.shift(); index !== undefined; index = queue.shift()) {
      // Workers share one queue, so each waits for its current session to end.
      // oxlint-disable-next-line no-await-in-loop
      results[index].push(await runPrompt(cases[index].prompt, project, model));
    }
  };
  await Promise.all(Array.from({ length: workers }, worker));
  return results;
}

function report(rows) {
  for (const { skill, loaded, expected, falseLoads, missed, extra } of rows) {
    console.log(`${skill.padEnd(8)} ${loaded}/${expected} loaded, ${falseLoads} false loads`);
    for (const prompt of missed) console.log(`  missed: ${prompt}`);
    for (const prompt of extra) console.log(`  false load: ${prompt}`);
  }
}

if (import.meta.main) {
  const { values } = parseArgs({
    options: {
      model: { type: 'string', default: 'claude-sonnet-5-5' },
      runs: { type: 'string', default: '1' },
      limit: { type: 'string' },
    },
  });
  const allCases = JSON.parse(readFileSync('evals/triggers.json', 'utf8'));
  const cases = values.limit ? allCases.slice(0, Number(values.limit)) : allCases;
  const project = mkdtempSync(join(tmpdir(), 'trigger-eval-'));
  mkdirSync(join(project, '.claude'));
  cpSync('skills', join(project, '.claude', 'skills'), { recursive: true });
  try {
    const results = await runAll(cases, project, values.model, Number(values.runs));
    report(score(cases, results));
  } finally {
    rmSync(project, { recursive: true });
  }
}
