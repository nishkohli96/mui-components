import { NextResponse } from 'next/server';
import {
  sidebarLinks,
  currentDocsVersion,
  websiteUrl,
  defaultPageTitle,
  defaultPageDescription
} from '@/constants';
import { buildVersionedSidebar } from '@/utils';
import type { Page } from '@/types';

function toMarkdownLines(pages: Page[], depth = 0): string[] {
  const indent = '  '.repeat(depth);
  return pages.flatMap(page => {
    if (page.pages?.length) {
      return [`${indent}- ${page.title}`, ...toMarkdownLines(page.pages, depth + 1)];
    }
    return page.href ? [`${indent}- [${page.title}](${websiteUrl}${page.href})`] : [];
  });
}

/**
 * llms.txt (https://llmstxt.org) — a link index for AI crawlers/assistants,
 * generated from `sidebarLinks` so it can't drift from the real site nav.
 * Ignored by Google; current-version pages only, same as `sitemap.ts`.
 */
export function GET() {
  const lines = [
    `# ${defaultPageTitle}`,
    '',
    `> ${defaultPageDescription}`,
    '',
    ...toMarkdownLines(buildVersionedSidebar(sidebarLinks, currentDocsVersion))
  ];

  return new NextResponse(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
