import { componentNames } from '@nish1896/rag-config';

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Matches a normalized token both with and without the "MUI" prefix,
 * so either form resolves to the canonical name.
 */
const canonicalByNormalized = new Map<string, string>();
for (const name of componentNames) {
  canonicalByNormalized.set(normalize(name), name);
  canonicalByNormalized.set(normalize(name.replace(/^MUI/i, '')), name);
}

/**
 * Rewrites component mentions in a query to their canonical MUI-prefixed
 * name before embedding — "number-input", "numberinput", and "NumberInput"
 * all normalize to the same key as "MUINumberInput" and get replaced with
 * it. The corpus text always uses the canonical name, so a query missing
 * the "MUI" prefix or using different casing/separators can otherwise embed
 * too far from the right chunk to clear the relevance threshold.
 *
 * Exact normalized match only, not fuzzy/typo-tolerant — a real misspelling
 * ("Numberinut") won't match here and falls back entirely to semantic
 * search, which handles minor typos reasonably well on its own via subword
 * tokenization.
 */
export function expandComponentMentions(question: string): string {
  return question
    .split(/(\s+)/)
    .map(token => canonicalByNormalized.get(normalize(token)) ?? token)
    .join('');
}
