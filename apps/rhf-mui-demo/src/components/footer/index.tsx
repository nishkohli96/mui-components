import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MySocials } from '@/constants';

/**
 * Slim, quiet footer: social links and a one-line credit above a top border.
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {MySocials.map(social => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex' }}
          >
            <Tooltip title={social.name}>
              <Image
                src={social.imgSrc}
                alt={social.name}
                width={26}
                height={26}
              />
            </Tooltip>
          </Link>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary">
        Made with ❤️ by Nish
      </Typography>
    </Box>
  );
};

export default Footer;
