/**
 * Eval harness: runs questions.json against the live /api/answer route and
 * scores retrieval + synthesis + guardrail correctness. Re-run this after
 * any change to chunking, the relevance threshold, or the synthesis prompt —
 * it's the thing that replaces "looks right to me" with a number.
 *
 * Requires the docs app running (`pnpm --filter docs dev`, default
 * http://localhost:3000) — hits the real route rather than importing
 * internals, so it exercises the same code path a real user does.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { NOT_COVERED_ANSWER } from '@nish1896/rag-config';
import type { EvalQuestion, EvalResult, EvalRun } from './types';

const QUESTIONS_FILE = path.resolve(import.meta.dirname, 'questions.json');
const RESULTS_FILE = path.resolve(import.meta.dirname, '../../.output/eval-results.json');
const HISTORY_FILE = path.resolve(import.meta.dirname, '../../.output/eval-history.json');
const BASE_URL = process.env.EVAL_BASE_URL ?? 'http://localhost:3000';

async function askQuestion(question: string): Promise<{ answer: string; citedPageUrls: string[] }> {
  const res = await fetch(`${BASE_URL}/api/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  if (!res.ok) {
    throw new Error(`/api/answer returned ${res.status} for question: "${question}"`);
  }

  const data = await res.json();
  const citedPageUrls: string[] = (data.citations ?? []).map((c: { pageUrl: string }) => c.pageUrl);
  return { answer: data.answer, citedPageUrls };
}

function scoreQuestion(q: EvalQuestion, answer: string, citedPageUrls: string[]): string[] {
  const failures: string[] = [];

  if (!q.expectMatch) {
    if (answer !== NOT_COVERED_ANSWER) {
      failures.push(`expected the "not covered" fallback, got: "${answer}"`);
    }
    return failures;
  }

  if (answer === NOT_COVERED_ANSWER) {
    failures.push('expected a real answer, got the "not covered" fallback');
    return failures;
  }

  for (const keyword of q.expectedKeywords ?? []) {
    if (!answer.toLowerCase().includes(keyword.toLowerCase())) {
      failures.push(`answer missing expected keyword: "${keyword}"`);
    }
  }

  if (q.expectedPageUrl && !citedPageUrls.includes(q.expectedPageUrl)) {
    failures.push(`expected a citation to "${q.expectedPageUrl}", got: [${citedPageUrls.join(', ')}]`);
  }

  return failures;
}

async function main() {
  const questions: EvalQuestion[] = JSON.parse(await readFile(QUESTIONS_FILE, 'utf-8'));
  const results: EvalResult[] = [];

  for (const q of questions) {
    const { answer, citedPageUrls } = await askQuestion(q.question);
    const failures = scoreQuestion(q, answer, citedPageUrls);
    const passed = failures.length === 0;
    results.push({ question: q.question, passed, failures, answer, citedPageUrls });

    console.log(`${passed ? 'PASS' : 'FAIL'} — ${q.question}`);
    for (const f of failures) console.log(`  - ${f}`);
  }

  const passed = results.filter(r => r.passed).length;
  const run: EvalRun = {
    timestamp: new Date().toISOString(),
    total: results.length,
    passed,
    passRate: passed / results.length,
    results
  };

  console.log(`\n${passed}/${results.length} passed (${(run.passRate * 100).toFixed(0)}%)`);

  await mkdir(path.dirname(RESULTS_FILE), { recursive: true });
  await writeFile(RESULTS_FILE, JSON.stringify(run, null, 2));

  const history: EvalRun[] = await readFile(HISTORY_FILE, 'utf-8')
    .then(JSON.parse)
    .catch(() => []);
  history.push(run);
  await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

main();
