'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  websiteUrl,
  componentSourceLink,
  defaultPageTitle,
  personalWebsite
} from '@/constants';
import { getAdjacentPages, getBreadcrumbTrail, toCanonicalPath } from '@/utils';
import lastmodMap from '@/generated/sitemap-lastmod.json';

type NavCardProps = {
  href: string;
  title: string;
  direction: 'prev' | 'next';
};

const NavCard = ({ href, title, direction }: NavCardProps) => {
  const isPrev = direction === 'prev';

  return (
    <Paper
      component={NextLink}
      href={href}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isPrev ? 'flex-start' : 'flex-end',
        gap: 0.5,
        px: 2.5,
        py: 1.5,
        borderRadius: 2,
        textDecoration: 'none',
        color: 'inherit',
        bgcolor: 'transparent',
        minWidth: 0,
        maxWidth: '48%',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
          '& .page-nav-title': { color: 'primary.main' }
        }
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600
        }}
      >
        {isPrev && <ArrowBackIcon sx={{ fontSize: 14 }} />}
        {isPrev ? 'Previous' : 'Next'}
        {!isPrev && <ArrowForwardIcon sx={{ fontSize: 14 }} />}
      </Typography>
      <Typography
        variant="body1"
        noWrap
        className="page-nav-title"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          maxWidth: '100%',
          transition: 'color 0.15s ease'
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

/**
 * Docusaurus-style footer nav — links to the previous/next page in the
 * sidebar's reading order. Rendered by `DocsPage` on every doc page; renders
 * nothing on pages outside `sidebarLinks` (e.g. a 404).
 */
const PageNav = () => {
  const pathname = usePathname();
  const { prev, next } = getAdjacentPages(pathname);
  const trail = getBreadcrumbTrail(pathname);

  const breadcrumbJsonLd = trail.length > 0 && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { title: 'Home', href: '/' },
      ...trail
    ].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      /* Home is `''` not `/`, so its URL matches the slash-less home canonical. */
      item: `${websiteUrl}${item.href === '/' ? '' : item.href}`
    }))
  };

  /*
   * `SoftwareSourceCode` on component pages only, reusing the breadcrumb
   * trail's own last title as `name` — no per-page description wiring
   * needed (`componentMetadata` is keyed by component name, not by path,
   * so there's no existing map from `pathname` to it). `codeRepository`
   * points at the component's actual source file, derived from the same
   * canonical path (`/components/mui/textfield` → `.../mui/textfield/index.tsx`).
   */
  const canonicalPath = toCanonicalPath(pathname);
  const componentSrcPath = canonicalPath.startsWith('/components/')
    ? canonicalPath.replace('/components', '')
    : null;
  const componentTitle = trail.at(-1)?.title;
  const softwareJsonLd = componentSrcPath && componentTitle && {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: componentTitle,
    codeRepository: componentSourceLink(componentSrcPath),
    programmingLanguage: 'TypeScript',
    url: `${websiteUrl}${pathname}`
  };

  /*
   * `TechArticle` for the doc page itself (component pages only), alongside the
   * `SoftwareSourceCode` for the code it documents. `dateModified` reuses the
   * per-route git commit date already generated for the sitemap — no
   * per-page description map exists, so `headline` is the only text.
   */
  const lastmod: Record<string, string> = lastmodMap;
  const techArticleJsonLd = componentSrcPath && componentTitle && {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: componentTitle,
    url: `${websiteUrl}${pathname}`,
    ...(lastmod[canonicalPath] && { dateModified: lastmod[canonicalPath] }),
    author: { '@type': 'Person', name: 'Nishant Kohli', url: personalWebsite },
    isPartOf: { '@type': 'WebSite', name: defaultPageTitle, url: websiteUrl },
    about: { '@type': 'SoftwareSourceCode', name: componentTitle }
  };

  const jsonLdBlocks = [
    breadcrumbJsonLd,
    softwareJsonLd,
    techArticleJsonLd
  ].filter(Boolean);
  const jsonLdScripts = jsonLdBlocks.map((block, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
    />
  ));

  if (!prev && !next) {
    return (
      <>
        {jsonLdScripts}
      </>
    );
  }

  return (
    <>
      {jsonLdScripts}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mt: 6,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {prev
          ? (
            <NavCard
              href={prev.href}
              title={prev.title}
              direction="prev"
            />
          )
          : <Box />}
        {next
          ? (
            <NavCard
              href={next.href}
              title={next.title}
              direction="next"
            />
          )
          : <Box />}
      </Box>
    </>
  );
};

export default PageNav;
