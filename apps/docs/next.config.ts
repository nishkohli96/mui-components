import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* .mdx pages compile to server components — docs ship as static HTML. */
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  /* Don't advertise the framework in an `X-Powered-By` response header. */
  poweredByHeader: false,
  /*
   * Docs pages are all static — no dynamic route needs a fresh response per
   * request. Vercel's default for static HTML is `public, max-age=0,
   * must-revalidate` (every browser must revalidate on each visit); this lets
   * the CDN serve a cached copy for 5 minutes past a deploy while it revalidates.
   *
   * The security headers are static too: HSTS forces HTTPS on repeat visits,
   * `nosniff` stops MIME-confusion on the SVGs served via `dangerouslyAllowSVG`,
   * and `frame-ancestors`/`X-Frame-Options` block clickjacking of the docs.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      }
    ],
  }
};

const withMDX = createMDX({
  options: {
    /**
     * Turbopack requires plugins as serializable strings, not imports.
     * - remark-gfm: GitHub-flavored markdown (props tables).
     * - rehype-slug: ids on headings for anchors + the page TOC.
     * - @shikijs/rehype: build-time highlighting of ```fences``` with
     *   VS Code's Light+/Dark+ themes; both palettes are emitted as CSS
     *   variables and switched in globals.css via data-mui-color-scheme.
     */
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      [
        '@shikijs/rehype',
        {
          themes: { light: 'light-plus', dark: 'dark-plus' },
          defaultColor: false
        }
      ]
    ]
  }
});

export default withMDX(nextConfig);
