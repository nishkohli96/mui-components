import { sidebarLinks, defaultPageTitle } from '@/constants';
import type { Page, PageInfo } from '@/types';

export function getPageTitle(title: string) {
  return `${title} | ${defaultPageTitle}`;
}


/** Depth-first flatten of the sidebar tree into linkable leaf pages, in reading order — category headers (no `href`) are skipped. */
function flattenPages(pages: Page[]): PageInfo[] {
  return pages.flatMap(page => {
    if (page.pages?.length) {
      return flattenPages(page.pages);
    }
    return page.href ? [{ title: page.title, href: page.href }] : [];
  });
}

const orderedPages = flattenPages(sidebarLinks);

export type AdjacentPages = {
  prev?: PageInfo;
  next?: PageInfo;
};

/**
 * Prev/next neighbors of `pathname` in the sidebar's reading order — powers
 * the Docusaurus-style footer nav rendered by `DocsPage`.
 */
export function getAdjacentPages(pathname: string): AdjacentPages {
  const index = orderedPages.findIndex(page => page.href === pathname);
  if (index === -1) {
    return {};
  }
  return {
    prev: orderedPages[index - 1],
    next: orderedPages[index + 1]
  };
}
