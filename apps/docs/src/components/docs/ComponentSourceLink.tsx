'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import { githubRepoLink } from '@/constants';
import packageJson from '../../../../../packages/mui-components/package.json';

/**
 * Component doc pages mirror the package's own folder structure 1:1
 * (`/components/mui/textfield` <-> `packages/mui-components/src/mui/textfield`),
 * so the source path is derived from the URL rather than hand-maintained
 * per page. `/v{N}/components/...` pages (older docs versions) link to the
 * `version-{N}` branch that snapshot was built from; the current docs link
 * to the tag matching this package's own `package.json` version — not the
 * live npm registry, so it stays correct even for an unreleased version
 * being worked on locally.
 */
const pageSourcePath = /^(?:\/v(\d+))?\/components\/(.+)$/;

/**
 * Renders nothing on non-component pages (introduction, installation, etc.)
 * — only component docs have a matching source file.
 */
const ComponentSourceLink = () => {
  const pathname = usePathname();
  const match = pageSourcePath.exec(pathname);
  if (!match) return null;

  const [, docsVersion, relativePath] = match;
  const ref = docsVersion
    ? `version-${docsVersion}`
    : `v${packageJson.version}`;
  const href = `${githubRepoLink}/blob/${ref}/packages/mui-components/src/${relativePath}/index.tsx`;

  return (
    <Box
      sx={{
        mt: 4,
        pt: 3,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography
        component="h2"
        variant="h5"
        className="doc-heading"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Source Code
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View the full implementation of this component on
        {' '}
        <MuiLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          GitHub
        </MuiLink>
        .
      </Typography>
    </Box>
  );
};

export default ComponentSourceLink;
