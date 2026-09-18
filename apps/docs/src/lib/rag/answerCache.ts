import type { Citation } from '@/app/api/answer/route';
import type { ExternalLink } from './muiLinks';

/**
 * Embedding-similarity cache for /api/answer: near-duplicate questions
 * ("does X support Y" vs "can X do Y") reuse a cached answer instead of
 * paying for another LLM synthesis call — exact-string caching would miss
 * these since the wording differs.
 *
 * In-memory, capped, oldest-evicted — same "no extra infra" tradeoff as the
 * rate limiter. Resets on redeploy/cold start, which is fine: worst case is
 * a cache miss, not a wrong answer.
 */
const MAX_ENTRIES = 200;
/**
 * Calibrated against a spot-check with `text-embedding-3-small`: a genuine
 * paraphrase ("does X support Y" vs "can X format the value with Y") scored
 * 0.8486, while a different prop on the *same* component ("renderValue" vs
 * "min") scored only 0.6634 — 0.83 sits with margin above the negative case
 * while still catching the paraphrase. Not eval-harness-tuned; revisit if
 * real usage shows false cache hits (unrelated questions sharing an answer)
 * or misses (obvious paraphrases not hitting cache).
 */
const SIMILARITY_THRESHOLD = 0.83;

type CacheEntry = {
  embedding: number[];
  answer: string;
  citations: Citation[];
  externalLinks: ExternalLink[];
  /** The synthesis prompt version active when this answer was generated — see promptVersion param below. */
  promptVersion: number;
};

const cache: CacheEntry[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * `promptVersion` must match the caller's current version, not just the
 * embedding similarity — otherwise a bad answer cached under an old prompt
 * (e.g. a false "not covered" that a prompt fix would have avoided) stays
 * stuck in the cache, sometimes indefinitely, since a fixed prompt has no
 * other way to know the old entry is stale. Bumping the caller's version
 * constant makes every prior entry invisible to lookups immediately —
 * they just age out via the MAX_ENTRIES cap instead of ever being served.
 */
export function getCachedAnswer(embedding: number[], promptVersion: number): CacheEntry | undefined {
  return cache.find(
    entry => entry.promptVersion === promptVersion && cosineSimilarity(entry.embedding, embedding) >= SIMILARITY_THRESHOLD
  );
}

export function setCachedAnswer(
  embedding: number[],
  answer: string,
  citations: Citation[],
  externalLinks: ExternalLink[],
  promptVersion: number
): void {
  if (cache.length >= MAX_ENTRIES) {
    cache.shift();
  }
  cache.push({ embedding, answer, citations, externalLinks, promptVersion });
}
