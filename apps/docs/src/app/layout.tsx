import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Box from '@mui/material/Box';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import {
  defaultPageTitle,
  defaultPageDescription,
  defaultPageKeywords
} from '@/constants';
import {
  AppBar,
  ConfigProviderWrapper,
  Drawer,
  FirebaseAnalytics,
  Footer
} from '@/components';
import { AppThemeProvider } from '@/theme';
import { colorSchemeAttribute, modeStorageKey } from '@/theme/constants';
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ['latin'] });

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
  title: {
    template: `%s | ${defaultPageTitle}`,
    default: defaultPageTitle
  },
  description: defaultPageDescription,
  keywords: defaultPageKeywords
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Must be the first body child — see colorSchemeInit above. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: colorSchemeInit }}
        />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <AppThemeProvider>
            <AppBar />
            <Box className="content" sx={{ display: 'flex' }}>
              <Box
                component="nav"
                aria-label="Component pages"
                sx={{
                  width: 260,
                  flexShrink: 0,
                  display: { xs: 'none', md: 'block' },
                  position: 'sticky',
                  top: 64,
                  alignSelf: 'flex-start',
                  height: 'calc(100vh - 64px)',
                  overflowY: 'auto',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  py: 1.5
                }}
              >
                <Drawer />
              </Box>
              <Box
                component="main"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: { xs: '20px 16px 36px', md: '28px 28px 48px' }
                }}
              >
                <ConfigProviderWrapper>
                  {children}
                </ConfigProviderWrapper>
              </Box>
            </Box>
            <Footer />
            <FirebaseAnalytics />
            <Analytics />
            <ToastContainer
              autoClose={3000}
              limit={3}
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
