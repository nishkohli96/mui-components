import type { Metadata } from 'next';
import HomeLanding from '@/components/home';
import {
  pageMetadata,
  websiteUrl,
  personalWebsite,
  githubProfile,
  githubRepoLink,
  npmLink,
  appName,
  defaultPageDescription
} from '@/constants';

export const metadata: Metadata = pageMetadata.home;

/*
 * WebSite + SoftwareSourceCode (the package entity) + Person, on the homepage
 * only — the author identity that used to sit in the root layout (and so
 * repeated on every page) belongs on one canonical page. Component pages carry
 * their own BreadcrumbList / SoftwareSourceCode / TechArticle.
 */
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: appName,
      url: websiteUrl
    },
    {
      '@type': 'Person',
      name: 'Nishant Kohli',
      url: personalWebsite,
      sameAs: [githubProfile, githubRepoLink, npmLink]
    },
    {
      '@type': 'SoftwareSourceCode',
      name: '@nish1896/mui-components',
      description: defaultPageDescription,
      url: npmLink,
      codeRepository: githubRepoLink,
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'React',
      license: 'https://opensource.org/licenses/MIT',
      author: { '@type': 'Person', name: 'Nishant Kohli', url: personalWebsite }
    },
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
