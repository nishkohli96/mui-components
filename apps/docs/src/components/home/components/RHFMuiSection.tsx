'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { GradientButton } from '@/components';

export default function RHFMuiSection() {
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{
        mt: { xs: 7, md: 9 },
        mx: 'auto',
        maxWidth: 720,
        p: { xs: 4, md: 5 },
        borderRadius: 2,
        textAlign: 'center',
        bgcolor: 'action.hover'
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'text.secondary'
        }}
      >
        Companion project
      </Typography>
      <Typography
        component="h2"
        sx={{
          mt: 1,
          fontSize: { xs: 22, md: 28 },
          fontWeight: 800,
          lineHeight: 1.2
        }}
      >
        Using React Hook Form in your application?
      </Typography>
      <Typography
        sx={{
          mt: 1.5,
          mx: 'auto',
          maxWidth: 520,
          color: 'text.secondary',
          fontSize: { xs: 14, md: 16 },
          lineHeight: 1.65
        }}
      >
        <MuiLink
          href="https://www.npmjs.com/package/@nish1896/rhf-mui-components"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontWeight: 700 }}
        >
          @nish1896/rhf-mui-components
        </MuiLink>
        {' '}
        binds the same label, error and helper-text system straight into React
        Hook Form&apos;s
        {' '}
        <code>Controller</code>
        {' '}
        — typed, validated, and ready to
        drop in.
      </Typography>
      <GradientButton
        component="a"
        href="https://rhf-mui-components.vercel.app/"
        rel="noopener noreferrer"
        target="_blank"
        endIcon={<ArrowForwardRoundedIcon />}
        sx={{ mt: 3 }}
      >
        Explore RHF-MUI Components
      </GradientButton>
    </Paper>
  );
}
