import Alert, { type AlertProps } from '@mui/material/Alert';

/**
 * Admonition block registered globally for .mdx pages. Callouts are written
 * as JSX, and Markdown continues to work inside:
 *
 * <Callout severity="info">
 *   Some **markdown** with a [link](/somewhere).
 * </Callout>
 */
const Callout = (alertProps: AlertProps) => (
  <Alert
    sx={{
      my: 2.5,
      borderRadius: 2,
      '& p': { margin: 0 }
    }}
    {...alertProps}
  />
);

export default Callout;
