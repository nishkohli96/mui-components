import Link from 'next/link';
import Image from 'next/image';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DrawerMenu from './DrawerMenu';
import { GithubButton, ThemeChangeButton } from '../buttons';
import RHFMuiLogo from '../../../public/rhf-mui.png';

/**
 * Sticky, flat docs-style header: brand on the left, actions on the right.
 * On small screens the side navigation collapses into the DrawerMenu button.
 */
const AppBar = () => {
  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderBottom: '1px solid',
        borderColor: 'primary.main',
        '[data-mui-color-scheme="dark"] &': {
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderColor: 'divider'
        }
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 0.5 }}>
        <DrawerMenu />
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'inherit',
            minWidth: 0
          }}
        >
          <Image
            src={RHFMuiLogo}
            alt="RHF-Mui Components logo"
            width={36}
            height={36}
            style={{
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: '1.05rem',
              letterSpacing: 0.2
            }}
          >
            RHF-Mui Components
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <GithubButton />
        <ThemeChangeButton />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
