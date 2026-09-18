import { componentNames } from '@nish1896/rag-config';

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Prefixes shorter than this aren't matched — avoids very short tokens ("in", "se") prefix-matching too broadly. */
const MIN_PARTIAL_LENGTH = 3;

const normalizedEntries = componentNames.map(name => ({
  name,
  full: normalize(name),
  short: normalize(name.replace(/^MUI/i, ''))
}));

/**
 * All canonical component names a token could plausibly mean — exact match
 * (with or without "MUI" prefix) or a prefix match ("native" → "MUINativeSelect",
 * "number" → both "MUINumberInput" and "MUINumberStepper", since both start
 * with it). Ambiguous prefixes intentionally return every match rather than
 * guessing one; `expandComponentMentions` appends all of them as hints and
 * lets embedding/retrieval sort out which is actually relevant.
 */
function findComponentMatches(rawToken: string): string[] {
  const token = normalize(rawToken);
  if (token.length < MIN_PARTIAL_LENGTH) return [];
  return normalizedEntries
    .filter(e => e.full === token || e.short === token || e.short.startsWith(token) || e.full.startsWith(token))
    .map(e => e.name);
}

/**
 * Appends the canonical MUI-prefixed name(s) any component mention in the
 * query could plausibly refer to, before embedding — covers missing "MUI"
 * prefix, different casing/separators ("number-input", "numberinput",
 * "NumberInput"), and partial mentions ("native", "number"). The corpus
 * text always uses the canonical name, so a query missing it can otherwise
 * embed too far from the right chunk to clear the relevance threshold.
 * Appending rather than replacing keeps the original phrasing intact while
 * still giving the embedding (and the retrieval lexical rescue, which scans
 * this same expanded text) the exact token to match against.
 *
 * Exact/prefix match only, not fuzzy/typo-tolerant — a real misspelling
 * ("Numberinut") won't match here and falls back entirely to semantic
 * search, which handles minor typos reasonably well on its own via subword
 * tokenization.
 */
export function expandComponentMentions(question: string): string {
  const matched = new Set<string>();
  for (const token of question.split(/\s+/)) {
    for (const name of findComponentMatches(token)) matched.add(name);
  }
  return matched.size === 0 ? question : `${question} ${[...matched].join(' ')}`;
}
