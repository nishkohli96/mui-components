export type ExternalLink = { label: string; url: string };

const MUI_MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https:\/\/(?:www\.)?mui\.com(?:\/[^)\s]*)?)\)/g;

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
