import Link from 'next/link';
import Image from 'next/image';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import RHFMuiLogo from '../../../public/rhf-mui.png';
import DrawerMenu from './DrawerMenu';
import {
  DocsButton,
  GithubButton,
  ThemeChangeButton
} from '../buttons';

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
        /* Brand blue in light mode, flat paper strip in dark mode.
           Static selector (not an sx callback) so this server component
           can pass it to the client MuiAppBar. */
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
        <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
          <DocsButton />
        </Box>
        <GithubButton />
        <ThemeChangeButton />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
