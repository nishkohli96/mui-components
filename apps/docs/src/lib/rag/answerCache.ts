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
 * A pure cosine threshold turned out unsafe at 0.83: "numberinput min prop"
 * vs "numberinput max prop" — two DIFFERENT props, wrong to ever share an
 * answer — scored 0.8907, *higher* than the genuine paraphrase pair used to
 * calibrate the original threshold (0.8486, "does X support Y" vs "can X
 * format the value with Y"). A single-word swap between near-synonym
 * technical terms ("min"/"max") embeds closer than a full paraphrase does,
 * so no cutoff between 0.85 and 0.89 is safe.
 *
 * 0.95 sacrifices that genuine-paraphrase cache hit (a miss there just costs
 * one extra LLM call) to stay safely clear of the false-positive case (a hit
 * there serves a confidently wrong answer) — correctness over hit rate.
 * Still not eval-harness-tuned; a real fix would veto hits across chunks
 * with different prop names (the same lexical-rescue idea used in
 * retrieve.ts) rather than relying on cosine similarity alone.
 */
const SIMILARITY_THRESHOLD = 0.95;

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
