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
 * Quick links to the most-searched-for component pages, rendered on the
 * homepage below the "Get Started" button — gives search/AI crawlers
 * (and first-time visitors) a shortcut past the sidebar to real docs pages.
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
      Popular components
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
