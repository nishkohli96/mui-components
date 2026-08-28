import type { MetadataRoute } from 'next';
import { sidebarLinks, currentDocsVersion, websiteUrl } from '@/constants';
import { buildVersionedSidebar } from '@/utils';
import type { Page } from '@/types';

function flattenHrefs(pages: Page[]): string[] {
  return pages.flatMap(page => {
    if (page.pages) {
      return flattenHrefs(page.pages);
    }
    return page.href ? [page.href] : [];
  });
}

/**
 * Generated from `sidebarLinks`, current version only — stays in sync with
 * the sidebar without a separate route list to maintain. Older versions
 * (`/v1/**`) are noindex, so they're deliberately excluded: a noindexed URL
 * in the sitemap is a GSC "Submitted URL marked 'noindex'" error.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = flattenHrefs(buildVersionedSidebar(sidebarLinks, currentDocsVersion));

  /*
   * No `lastModified` — a build timestamp would mark every URL "modified" on
   * every deploy regardless of actual content changes, and Google already
   * discounts a sitemap's lastmod once it stops looking trustworthy.
   */
  return ['/', ...hrefs].map(href => ({
    url: `${websiteUrl}${href}`,
    changeFrequency: 'monthly',
  }));
}
