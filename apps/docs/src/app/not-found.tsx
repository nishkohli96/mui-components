import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { NotFoundActions } from '@/components';
import { pageMetadata } from '@/constants';

export const metadata = pageMetadata.notFound;

/**
 * `AppShell` (root layout) already renders the site `AppBar` for every
 * non-home route, including this one — no need to render it again here.
 */
const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Image
          src="/icons/mui-404.svg"
          alt="404"
          width={320}
          height={200}
          priority
          style={{ width: '100%', maxWidth: 320, height: 'auto' }}
        />
        <Typography
          variant="h4"
          sx={{ mt: { md: 2 }, fontWeight: 800 }}
        >
          Component not found
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            color: 'text.secondary',
            maxWidth: 420
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Check the URL, or head back to where you came from.
        </Typography>
        <NotFoundActions />
      </Container>
    </Box>
  );
};

export default NotFound;
