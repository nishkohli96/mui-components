import type { Metadata } from 'next';
import HomeLanding from '@/components/home';
import {
  pageMetadata,
  websiteUrl,
  personalWebsite,
  githubProfile,
  githubRepoLink,
  npmLink,
  defaultPageTitle
} from '@/constants';

export const metadata: Metadata = pageMetadata.home;

/*
 * WebSite + Person on the homepage only — the author identity that used to
 * sit in the root layout (and so repeated on every page) belongs on one
 * canonical page. Component pages already carry BreadcrumbList and
 * SoftwareSourceCode of their own.
 */
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: defaultPageTitle,
      url: websiteUrl
    },
    {
      '@type': 'Person',
      name: 'Nishant Kohli',
      url: personalWebsite,
      sameAs: [githubProfile, githubRepoLink, npmLink]
    }
  ]
};

const HomePage = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
    />
    <HomeLanding />
  </>
);

export default HomePage;
