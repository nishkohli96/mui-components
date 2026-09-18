import GithubSlugger from 'github-slugger';
import type { RetrievedMatch } from '@nish1896/rag-config';

/**
 * The page anchor a citation should link to, matching how the real page
 * generates ids: a `prop`-type chunk's heading is always `API > propName`,
 * and `PropsTable` gives that prop's row the id `prop-${name}` directly
 * (see PropsTable.tsx) — not a slug of the heading text. A `prose` chunk's
 * heading is an actual MDX heading, anchored via `rehype-slug` (see
 * mdx-components.tsx), so it needs the same slugger to reproduce the id.
 */
export function computeCitationAnchor(chunk: Pick<RetrievedMatch, 'type' | 'sectionHeading'>): string {
  if (chunk.type === 'prop') {
    return `prop-${chunk.sectionHeading.replace(/^API > /, '')}`;
  }
  return new GithubSlugger().slug(chunk.sectionHeading);
}
