import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { PropDoc } from '@/types';

type PropsTableProps = {
  /** Table rows, one per component prop. */
  rows: PropDoc[];
};

/**
 * API reference table for a component's props. Content is plain
 * server-rendered HTML (SEO-indexable); rows are authored as typed
 * `PropDoc[]` data so names/types stay compile-checked.
 */
const PropsTable = ({ rows }: PropsTableProps) => {
  return (
    <TableContainer component={Paper} variant="outlined" className="doc-props-table">
      <Table size="small" aria-label="Component props">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Default</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                <code className="doc-inline-code doc-prop-name">
                  {row.name}
                </code>
                {row.required && (
                  <span
                    className="doc-prop-required"
                    aria-label="required"
                    title="Required"
                  >
                    *
                  </span>
                )}
              </TableCell>
              <TableCell>
                <code className="doc-inline-code doc-prop-type">{row.type}</code>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {row.defaultValue
                  ? <code className="doc-inline-code">{row.defaultValue}</code>
                  : '-'}
              </TableCell>
              <TableCell sx={{ minWidth: 280 }}>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PropsTable;
