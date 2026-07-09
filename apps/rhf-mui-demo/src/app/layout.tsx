import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ['latin'] });

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
        {/*
          Color-scheme bootstrap (public/color-scheme-init.js): runs before
          hydration/first paint, reads localStorage and stamps
          data-mui-color-scheme on <html> — no theme flash.

          Replaces MUI's <InitColorSchemeScript>: any inline <script>
          rendered through React logs a dev console error on every load
          ("Encountered a script tag while rendering React component").
          A src-based `beforeInteractive` script is hoisted by Next outside
          the React tree, which avoids that entirely.
        */}
        <Script
          src="/color-scheme-init.js"
          strategy="beforeInteractive"
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
