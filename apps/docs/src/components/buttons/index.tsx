'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import { githubRepoLink, npmLink } from '@/constants';
import { useThemeContext } from '@/theme';

export const SubmitButton = ({ disabled, ...otherBtnProps }: ButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      sx={{ mr: '20px' }}
      disabled={disabled}
      {...otherBtnProps}
    >
      Submit
    </Button>
  );
};

export const ResetButton = (btnProps: ButtonProps) => {
  return (
    <Button variant="outlined" color="primary" {...btnProps}>
      Reset
    </Button>
  );
};

export const ThemeChangeButton = () => {
  const { currentTheme, toggleTheme } = useThemeContext();
  const isDarkTheme = currentTheme === 'dark';
  const toolTip = `Switch to ${isDarkTheme ? 'light' : 'dark'} theme`;

  return (
    <Tooltip title={toolTip}>
      <IconButton
        onClick={toggleTheme}
        aria-label={toolTip}
        color="inherit"
      >
        {isDarkTheme ? <BedtimeIcon /> : <LightModeIcon color="warning" />}
      </IconButton>
    </Tooltip>
  );
};

export const GithubButton = () => {
  return (
    <Tooltip title="Github">
      <IconButton
        component={Link}
        href={githubRepoLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Github"
        size="large"
        color="inherit"
        sx={{ padding: { xs: '6px', md: '12px' } }}
      >
        <Image
          src="https://img.icons8.com/fluency/30/github.png"
          alt="Github"
          width={26}
          height={26}
        />
      </IconButton>
    </Tooltip>
  );
};

export const NpmButton = () => {
  return (
    <Tooltip title="NPM">
      <IconButton
        component={Link}
        href={npmLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Npm"
        size="large"
        color="inherit"
        sx={{ padding: { xs: '6px', md: '12px' } }}
      >
        <Image
          src="https://img.icons8.com/color/30/npm.png"
          alt="NPM"
          width={30}
          height={30}
        />
      </IconButton>
    </Tooltip>
  );
};
