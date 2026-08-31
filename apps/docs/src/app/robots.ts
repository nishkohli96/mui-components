import type { MetadataRoute } from 'next';
import { websiteUrl } from '@/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${websiteUrl}/sitemap.xml`
  };
}
