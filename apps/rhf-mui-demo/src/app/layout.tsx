import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
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
import {
  colorSchemeAttribute,
  modeStorageKey
} from '@/theme/constants';
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
          Runs as a blocking script BEFORE React hydrates.
          Reads localStorage → applies data-color-scheme on <html>.
          Falls back to system preference if no stored value.
          Must come before the <main> element
        */}
        <InitColorSchemeScript
          attribute={colorSchemeAttribute}
          defaultMode="system"
          modeStorageKey={modeStorageKey}
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
