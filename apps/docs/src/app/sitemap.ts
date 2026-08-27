import type { MetadataRoute } from 'next';
import { sidebarLinks, docsVersions, websiteUrl } from '@/constants';
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
 * Generated from `sidebarLinks`, once per docs version (`buildVersionedSidebar`
 * already applies each version's URL prefix) — stays in sync with the sidebar
 * without a separate route list to maintain.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = docsVersions.flatMap(version =>
    flattenHrefs(buildVersionedSidebar(sidebarLinks, version)));

  return ['/', ...hrefs].map(href => ({
    url: `${websiteUrl}${href}`,
    lastModified: new Date()
  }));
}
