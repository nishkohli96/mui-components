import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

const popularComponents = [
  { title: 'Text Field', href: '/components/mui/textfield' },
  { title: 'Select', href: '/components/mui/select' },
  { title: 'Autocomplete', href: '/components/mui/autocomplete' },
  { title: 'File Uploader', href: '/components/mui/file-uploader' },
  { title: 'Date Picker', href: '/components/mui-pickers/date' },
  { title: 'Phone Input', href: '/components/misc/phone-input' }
];

/**
 * Curated shortlist of component pages, rendered on the homepage below the
 * "Get Started" button — the always-visible internal links to real docs pages
 * (the full directory further down is collapsed by default). Each links to a
 * page with a live demo, so the heading invites a click.
 */
const PopularComponents = () => (
  <Box sx={{ mt: 4 }}>
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        mb: 1.5,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600
      }}
    >
      See it in action
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1
      }}
    >
      {popularComponents.map(component => (
        <Chip
          key={component.title}
          component="a"
          href={component.href}
          label={component.title}
          clickable
          variant="outlined"
          size="small"
          sx={{
            fontWeight: 600,
            height: 'auto',
            '& .MuiChip-label': { px: 1.5, py: 0.6 },
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'transparent'
            }
          }}
        />
      ))}
    </Box>
  </Box>
);

export default PopularComponents;
