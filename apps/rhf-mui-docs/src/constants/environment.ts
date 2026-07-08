import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useEnvironmentConfig() {
  const { siteConfig } = useDocusaurusContext();
  return {
    EXAMPLES_URL: (siteConfig?.customFields?.EXAMPLES_URL as string) ?? 'https://mui-components-examples.vercel.app',
  };
}
