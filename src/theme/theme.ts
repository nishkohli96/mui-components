/**
 * https://v7.mui.com/material-ui/customization/css-theme-variables/configuration/
 */

'use client';

import { createTheme, type Theme } from '@mui/material/styles';
import {
  LightThemePalette,
  DarkThemePalette,
  CommonColorPalette
} from './palette';
import { colorSchemeAttribute } from './constants';
import { roboto } from './fonts';

export const theme: Theme = createTheme({
  cssVariables: {
    colorSchemeSelector: colorSchemeAttribute,
  },
  colorSchemes: {
    light: {
      palette: {
        ...CommonColorPalette,
        ...LightThemePalette,
      },
    },
    dark: {
      palette: {
        ...CommonColorPalette,
        ...DarkThemePalette,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 350,
      md: 768,
      lg: 1024,
      xl: 1400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    /**
     * Links show no underline at rest, only on hover — MUI's default is
     * `underline="always"`. Set app-wide so every MuiLink (folder tree,
     * links list, future ones) is consistent without a per-usage prop.
     */
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
});
