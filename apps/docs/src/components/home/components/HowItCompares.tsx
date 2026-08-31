import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Callout } from '@/components';

type RowDef = {
  label: string;
  values: [string, string, string];
};

const columns = [
  '@nish1896/mui-components',
  '@nish1896/rhf-mui-components',
  'Raw MUI + a form library'
];

const rows: RowDef[] = [
  {
    label: 'Form library',
    values: ['Any (or none)', 'React Hook Form', 'Whatever you wire up']
  },
  {
    label: 'Field contract',
    values: [
      'value / onValueChange / errorMessage',
      'RHF Controller-based',
      'You build it per field'
    ]
  },
  {
    label: 'Label + helper text + ARIA',
    values: ['Included, consistent', 'Included, consistent', 'Hand-rolled per field']
  },
  {
    label: 'Validation display',
    values: ['errorMessage prop', 'RHF error object', 'Hand-rolled per field']
  },
  {
    label: 'MUI prop pass-through',
    values: ['Yes', 'Yes', 'N/A (you own the markup)']
  },
  {
    label: 'TypeScript types',
    values: ['First-class', 'First-class', 'Depends on your wiring']
  }
];

/* The subject package — its column is tinted to stand out. */
const HIGHLIGHT_COL = 0;

/**
 * Feature comparison of this package against its React Hook Form sibling and
 * a hand-wired "raw MUI" setup. Moved here from the Introduction page so the
 * homepage carries the positioning up front.
 */
const HowItCompares = () => (
  <Box component="section" sx={{ mt: { xs: 7, md: 9 } }}>
    <Typography
      component="h2"
      sx={{
        textAlign: 'center',
        fontSize: { xs: 22, md: 28 },
        fontWeight: 800,
        lineHeight: 1.2
      }}
    >
      How it compares
    </Typography>
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ mt: 3, borderRadius: 2, overflowX: 'auto' }}
    >
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottomColor: 'divider' }} />
            {columns.map((col, index) => (
              <TableCell
                key={col}
                sx={{
                  fontWeight: 700,
                  fontFamily: index < 2
                    ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
                    : undefined,
                  fontSize: index < 2 ? 13 : 14,
                  borderBottomColor: 'divider',
                  ...(index === HIGHLIGHT_COL && { bgcolor: 'action.hover' })
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.label} sx={{ '&:last-of-type td': { border: 0 } }}>
              <TableCell
                component="th"
                scope="row"
                sx={{ fontWeight: 600, borderBottomColor: 'divider' }}
              >
                {row.label}
              </TableCell>
              {row.values.map((value, index) => (
                <TableCell
                  key={columns[index]}
                  sx={{
                    color: 'text.secondary',
                    borderBottomColor: 'divider',
                    ...(index === HIGHLIGHT_COL && {
                      bgcolor: 'action.hover',
                      color: 'text.primary'
                    })
                  }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ mt: 2, fontSize: { xs: 13, md: 14 }, lineHeight: 1.6 }}>
      <Callout type="tip">
        <Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
          Standardized on React Hook Form?
          {' '}
          <Box component="code" sx={{ fontWeight: 700 }}>
            rhf-mui-components
          </Box>
          {' '}
          is the closer fit.
        </Typography>
        <Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
          Using more than one form library — or want to drop a component into a
          screen with only
          {' '}
          <code>useState</code>
          ? This package keeps that choice open.
        </Typography>
      </Callout>
    </Box>
  </Box>
);

export default HowItCompares;
