import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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

/*
 * Last git commit date of the route's source file, so `lastmod` tracks real
 * content changes rather than deploy time (a build timestamp would mark every
 * URL modified on every deploy, and Google discounts a sitemap's lastmod once
 * it stops looking trustworthy). Returns undefined — which Next then omits
 * from the entry — when the file or git history isn't available, e.g. a
 * shallow CI checkout that doesn't reach the commit that last touched it.
 *
 * ponytail: spawns `git` once per route (~40x) at build; fine at this scale,
 * batch into a single `git log` call only if the route count grows large.
 *
 * ponytail: the dynamic `fs`/`child_process` access here makes Turbopack
 * trace the whole project ("Dynamic filesystem access" build warning).
 * Harmless for a docs app this size; if deploy bundle size ever bites, move
 * this into a `prebuild` script that emits a static JSON date map.
 */
function lastModified(href: string): Date | undefined {
  const dir = join(process.cwd(), 'src/app', href === '/' ? '' : href);
  const file = ['page.mdx', 'page.tsx']
    .map(name => join(dir, name))
    .find(existsSync);
  if (!file) {
    return undefined;
  }
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Generated from `sidebarLinks`, current version only — stays in sync with
 * the sidebar without a separate route list to maintain. Older versions
 * (`/v1/**`) are noindex, so they're deliberately excluded: a noindexed URL
 * in the sitemap is a GSC "Submitted URL marked 'noindex'" error.
 *
 * `changeFrequency` is omitted — Google ignores it entirely.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = flattenHrefs(buildVersionedSidebar(sidebarLinks, currentDocsVersion));

  return ['/', ...hrefs].map(href => ({
    url: `${websiteUrl}${href}`,
    lastModified: lastModified(href)
  }));
}
