import lastmodEntries from '@/generated/sitemap-lastmod.json';

/** Route -> last content change (ISO date), from `sitemap-lastmod.json`. */
export const lastmodByPath: Record<string, string> = Object.fromEntries(
  lastmodEntries.map(({ path, lastmod }) => [path, lastmod])
);
