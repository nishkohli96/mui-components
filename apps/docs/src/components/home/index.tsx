'use client';

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
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AppBar, Footer } from '@/components';
import CopyInstallCommand from './CopyInstallCommand';
import Wordmark from '../../../public/wordmark.svg';

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
      <AppBar />
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                height: { xs: 44, sm: 56, md: 64, lg: 75 },
                width: 'auto'
              }
            }}
          >
            <Image
              src={Wordmark}
              alt="MUI Components Wordmark"
              width={465}
              height={75}
              priority
            />
          </Box>
          <Typography
            variant="h1"
            sx={{
              mt: 3,
              fontSize: { xs: 30, sm: 34, md: 42, lg: 46 },
              lineHeight: 1.15,
              fontWeight: 800,
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
            href="/introduction"
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
      <Footer />
    </Box>
  );
};

export default HomeLanding;
