export type ExternalLink = { label: string; url: string };

const MUI_MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https:\/\/(?:www\.)?mui\.com(?:\/[^)\s]*)?)\)/g;
const ANY_MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const isExternalUrl = (url: string) => (/^https?:\/\//).test(url);

/**
 * Doc prose already links out to the official MUI v9 API docs for
 * passthrough props (e.g. "accepts most [TextFieldProps](https://mui.com/...)")
 * — components spread MUI's own props alongside the ones this library
 * documents itself, and those aren't in our props-table corpus at all.
 * Pulling the links straight out of whichever chunks the answer actually
 * used surfaces that reference without needing to index MUI's docs
 * ourselves.
 */
export function extractMuiLinks(content: string): ExternalLink[] {
  return [...content.matchAll(MUI_MARKDOWN_LINK_RE)].map(m => ({ label: m[1]!, url: m[2]! }));
}

/**
 * The synthesized "answer" string is LLM output, not doc content — if a
 * question manages to jailbreak the "answer only from context" system
 * prompt into emitting an external link, that link is otherwise
 * indistinguishable from a genuine one once cached and replayed to other
 * visitors asking a near-duplicate question (see `answerCache.ts`).
 *
 * Checked before caching: every external link in the answer must already
 * appear verbatim in the content of a chunk the model actually used —
 * i.e. it's a link the docs themselves provide, not one the model invented.
 * A relative link (an in-app doc path) is always fine.
 */
export function hasUnbackedExternalLink(answer: string, usedChunksContent: string[]): boolean {
  const backedUrls = new Set(
    usedChunksContent.flatMap(content => [...content.matchAll(ANY_MARKDOWN_LINK_RE)].map(m => m[2]!))
  );
  return [...answer.matchAll(ANY_MARKDOWN_LINK_RE)].some(
    m => isExternalUrl(m[2]!) && !backedUrls.has(m[2]!)
  );
}

/** Dedupes by URL, preserving first-seen label. */
export function dedupeLinks(links: ExternalLink[]): ExternalLink[] {
  const byUrl = new Map<string, ExternalLink>();
  for (const link of links) {
    if (!byUrl.has(link.url)) {
      byUrl.set(link.url, link);
    }
  }
  return [...byUrl.values()];
}
