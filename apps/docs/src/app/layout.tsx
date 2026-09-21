import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import {
  appName,
  defaultPageDescription,
  githubProfile,
  websiteUrl
} from '@/constants';
import AppShell from '@/components/app-shell';
import { AskAI } from '@/components';
import { AppThemeProvider } from '@/theme';
import { colorSchemeAttribute, modeStorageKey } from '@/theme/constants';
import { roboto } from '@/theme/fonts';
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

/*
 * DocSearch's own CSS reads a separate `data-theme` attribute (its
 * `[data-theme=dark]` selector), not MUI's `data-mui-color-scheme` — mirror
 * one into the other, synchronously, right after InitColorSchemeScript sets
 * it, so DocSearch never renders one frame behind on first paint.
 */
const syncDocSearchTheme = `document.documentElement.setAttribute('data-theme',document.documentElement.getAttribute('${colorSchemeAttribute}'));`;

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
        {/* Must be the first body child — runs before paint, no theme flash. */}
        <InitColorSchemeScript
          attribute={colorSchemeAttribute}
          modeStorageKey={modeStorageKey}
          defaultMode="system"
        />
        <script
          dangerouslySetInnerHTML={{ __html: syncDocSearchTheme }}
        />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <AppThemeProvider>
            <AppShell>
              {children}
            </AppShell>
            <AskAI />
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
