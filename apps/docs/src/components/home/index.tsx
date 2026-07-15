'use client';

/*
 * Landing page content. This must be a Client Component: it passes
 * `component={Link}` (a function) into MUI's Button/Link, which is not
 * serializable across the server -> client boundary — rendering it from a
 * Server Component 500s with "Functions cannot be passed directly to
 * Client Components". The route file (app/page.tsx) stays a Server
 * Component so it can export `metadata`.
 */

import Image from 'next/image';
import Link from 'next/link';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinkText from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ThemeChangeButton } from '@/components/buttons';
import CopyInstallCommand from './CopyInstallCommand';
import { githubRepoLink } from '@/constants';
import LogoSquare from '../../../public/logo-square.png';

const installCommand = 'npm install @nish1896/mui-components';

const features = [
  {
    icon: LockOpenRoundedIcon,
    title: 'No form-library lock-in',
    description:
      'Components speak value, onValueChange and errorMessage. Any state holder can drive them.'
  },
  {
    icon: CheckCircleRoundedIcon,
    title: 'Fully typed',
    description:
      'Written in TypeScript from the ground up, with precise prop types for every component.'
  },
  {
    icon: Inventory2RoundedIcon,
    title: 'Tree-shakable',
    description:
      'Import only what you use, with subpath exports for MUI, pickers and misc components.'
  },
  {
    icon: RouteRoundedIcon,
    title: 'Consistent form UX',
    description:
      'One label, error and helper-text system across all fields, with accessible names preserved.'
  }
];

const HomeLanding = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            <Image
              src={LogoSquare}
              alt=""
              width={30}
              height={30}
              priority
              style={{ borderRadius: 8 }}
            />
            <Typography
              component="span"
              sx={{ fontWeight: 800, fontSize: 17 }}
            >
              MUI-Components
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
            <LinkText
              component={Link}
              href="/introduction"
              underline="none"
              color="text.secondary"
              sx={{ fontWeight: 700, fontSize: 13 }}
            >
              Docs
            </LinkText>
            <LinkText
              href={githubRepoLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="text.secondary"
              sx={{ fontWeight: 700, fontSize: 13 }}
            >
              GitHub
            </LinkText>
            <ThemeChangeButton />
          </Stack>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 6, md: 10 }
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            maxWidth: 720,
            textAlign: 'center'
          }}
        >
          <Image
            src={LogoSquare}
            alt="MUI Components"
            width={68}
            height={68}
            priority
            style={{ borderRadius: 18 }}
          />
          <Typography
            variant="h1"
            sx={{
              mt: 3,
              fontSize: { xs: 38, md: 52 },
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: 0
            }}
          >
            Production-ready form components for Material UI
          </Typography>
          <Typography
            sx={{
              mt: 3,
              mx: 'auto',
              maxWidth: 560,
              color: 'text.secondary',
              fontSize: { xs: 15, md: 17 },
              lineHeight: 1.7,
              fontWeight: 500
            }}
          >
            25+ fully-typed, tree-shakable components, independent of any
            form library. Wire label placement, error state, and helper text
            once, then use it everywhere.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              mt: 4,
              mx: 'auto',
              width: 'fit-content',
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'action.hover'
            }}
          >
            <Box
              component="code"
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: 1.1,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: { xs: 11, sm: 13 },
                color: 'text.primary',
                whiteSpace: 'nowrap',
                overflowX: 'auto'
              }}
            >
              {installCommand}
            </Box>
            <CopyInstallCommand command={installCommand} />
          </Paper>

          <Button
            component={Link}
            href="/getting-started"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              mt: 3,
              px: 3,
              minWidth: 132,
              height: 42,
              borderRadius: 2,
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #2196f3 0%, #0bd1a8 100%)'
            }}
          >
            Get Started
          </Button>
        </Box>

        <Box
          sx={{
            mt: { xs: 7, md: 9 },
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))'
            },
            gap: 2.5
          }}
        >
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <Paper
                key={feature.title}
                variant="outlined"
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Icon color="primary" fontSize="small" />
                <Typography sx={{ mt: 2, fontWeight: 800 }}>
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: 'text.secondary',
                    fontSize: 14,
                    lineHeight: 1.55
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            minHeight: 76,
            py: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>
            © 2026 MUI-Components
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            Using React Hook Form?{' '}
            <LinkText
              href="https://rhf-mui-components.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="inherit"
              sx={{ fontWeight: 700 }}
            >
              Check out rhf-mui-components
            </LinkText>
            .
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2}>
            <LinkText
              component={Link}
              href="/introduction"
              underline="none"
              color="text.secondary"
              sx={{ fontSize: 13, fontWeight: 700 }}
            >
              Docs
            </LinkText>
            <LinkText
              href={githubRepoLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="text.secondary"
              sx={{ fontSize: 13, fontWeight: 700 }}
            >
              GitHub
            </LinkText>
            <LinkText
              href="https://www.npmjs.com/package/@nish1896/mui-components"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="text.secondary"
              sx={{ fontSize: 13, fontWeight: 700 }}
            >
              npm
            </LinkText>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeLanding;
