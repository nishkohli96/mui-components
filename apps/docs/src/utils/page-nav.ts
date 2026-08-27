import { sidebarLinks } from '@/constants';
import type { Page, PageInfo } from '@/types';
import {
  buildVersionedSidebar,
  getDocsVersion,
  toCanonicalPath,
  toVersionedPath
} from './docs-version';

/**
 * Depth-first flatten of the sidebar tree into linkable leaf pages, in
 * reading order — category headers (no `href`) are skipped.
 */
function flattenPages(pages: Page[]): PageInfo[] {
  return pages.flatMap(page => {
    if (page.pages?.length) {
      return flattenPages(page.pages);
    }
    return page.href ? [{ title: page.title, href: page.href }] : [];
  });
}

/**
 * Depth-first search for `targetHref`, collecting ancestor `{title, href}` pairs
 * along the way (category headers with no `href` are skipped — they're not a
 * linkable crumb).
 */
function findTrail(
  pages: Page[],
  targetHref: string,
  trail: PageInfo[]
): PageInfo[] | null {
  for (const page of pages) {
    const nextTrail = page.href
      ? [...trail, { title: page.title, href: page.href }]
      : trail;
    if (page.href === targetHref) {
      return nextTrail;
    }
    if (page.pages) {
      const found = findTrail(page.pages, targetHref, nextTrail);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Ancestor trail (root → current page) for `pathname`, each with its own
 * `href` — powers the `BreadcrumbList` structured data rendered by `DocsPage`.
 */
export function getBreadcrumbTrail(pathname: string): PageInfo[] {
  const version = getDocsVersion(pathname);
  const versionedPath = toVersionedPath(version, toCanonicalPath(pathname));
  return findTrail(buildVersionedSidebar(sidebarLinks, version), versionedPath, []) ?? [];
}

export type AdjacentPages = {
  prev?: PageInfo;
  next?: PageInfo;
};

/**
 * Prev/next neighbors of `pathname` in the sidebar's reading order — powers
 * the Docusaurus-style footer nav rendered by `DocsPage`.
 *
 * Resolved against the sidebar of the version owning `pathname`, so neighbours
 * stay inside that version and skip pages the version doesn't have.
 */
export function getAdjacentPages(pathname: string): AdjacentPages {
  const version = getDocsVersion(pathname);
  const orderedPages = flattenPages(
    buildVersionedSidebar(sidebarLinks, version)
  );

  /* Match on the versioned href, which is what the sidebar renders. */
  const versionedPath = toVersionedPath(version, toCanonicalPath(pathname));
  const index = orderedPages.findIndex(page => page.href === versionedPath);

  if (index === -1) {
    return {};
  }

  return {
    prev: orderedPages[index - 1],
    next: orderedPages[index + 1]
  };
}
