import type { ReactNode } from 'react';
import type { Metadata } from 'next';

/*
 * Every /v1/** page reuses the same `componentMetadata` as its /components/**
 * counterpart (same title/description) — noindex here, once, instead of on
 * ~25 individual pages, so Google doesn't see them as duplicates.
 * Crawl these pages, follow its links, but don't put it in search results, as
 * they are not the docs of the latest version.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true }
};

type V1LayoutProps = {
  children: ReactNode;
};

const V1Layout = ({ children }: V1LayoutProps) => children;

export default V1Layout;
