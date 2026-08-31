import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import {
  appName,
  defaultPageDescription,
  githubProfile,
  websiteUrl
} from '@/constants';
import AppShell from '@/components/app-shell';
import { AppThemeProvider } from '@/theme';
import { colorSchemeAttribute, modeStorageKey } from '@/theme/constants';
import { roboto } from '@/theme/fonts';
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

/*
 * Synchronous, no-flash color-scheme bootstrap. Runs as the first child of
 * <body>, so it executes during HTML parsing — before the browser paints
 * any body content — and stamps data-mui-color-scheme on <html> to match
 * the palette CSS already inlined in <head>.
 *
 * Why not `next/script strategy="beforeInteractive"`: that pushes the file
 * onto Next's async `__next_s` queue, which the runtime loads only AFTER the
 * first paint — so the page paints once in the default (light) scheme, then
 * repaints in the stored scheme. That one-frame repaint is the theme flash.
 * An inline <script dangerouslySetInnerHTML> has no such queue; it blocks and
 * runs in document order, guaranteeing the attribute is set before paint.
 * (Keep this logic in sync with src/theme/constants.ts.)
 */
const colorSchemeInit = `(function(){try{var m=localStorage.getItem('${modeStorageKey}')||'system';var s=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;document.documentElement.setAttribute('${colorSchemeAttribute}',s);}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(websiteUrl),
  title: {
    template: `%s | ${appName}`,
    default: appName
  },
  description: defaultPageDescription,
  applicationName: appName,
  authors: [{ name: 'Nishant Kohli', url: githubProfile }],
  creator: 'Nishant Kohli',
  /*
   * `./` resolves to the current route, so every page gets a self-referential
   * canonical from this one line — no per-page `alternates`, and version
   * copies (`app/v1/**`, a future `app/v2/**`) inherit it automatically.
   */
  alternates: { canonical: './' },
  /*
   * No `title`/`description` here — Next auto-inherits both from the
   * resolved page `title`/`description` above when a page doesn't set its
   * own `openGraph`/`twitter` object (see `inheritFromMetadata` in Next's
   * metadata resolver). Setting them here explicitly, even to the same
   * defaults, blocks that inheritance and pins every page to these values.
   */
  openGraph: {
    type: 'website',
    siteName: appName,
    url: './'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

/*
 * `theme-color` per scheme — matches `background.default` in `theme/palette.ts`
 * (light `#ffffff`, dark `#0b0e14`) so the mobile browser chrome blends with
 * the page instead of defaulting to white in dark mode.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0e14' }
  ]
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        {/* Must be the first body child — see colorSchemeInit above. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: colorSchemeInit }}
        />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <AppThemeProvider>
            <AppShell>
              {children}
            </AppShell>
            <Analytics />
            <ToastContainer
              autoClose={3000}
              limit={2}
              stacked
              closeButton
              style={{ fontSize: '1rem' }}
            />
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
