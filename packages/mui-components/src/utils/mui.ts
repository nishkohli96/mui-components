import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Anything that can be passed to an `sx` prop. The falsy values (`false`,
 * `null`, `undefined`) are accepted so a conditional style can be passed
 * inline, e.g. `mergeSx(baseSx, isActive && activeSx, props.sx)`.
 */
type SxInput = SxProps<Theme> | false | null | undefined;

/**
 * Combine several `sx` values into a single `sx` array.
 *
 * MUI's `sx` accepts an object, a theme-callback function, or an array of those.
 * Object-spreading two `sx` values (`{ ...a, ...b }`) silently breaks the last
 * two forms — an array collapses into numeric keys and a callback loses its
 * behaviour. Flattening into an array preserves every form. Later sources still
 * win, matching object-spread precedence.
 *
 * - Falsy sources (`false`, `null`, `undefined`) are skipped.
 * - Array sources are spread one level; their own entries (objects, callbacks,
 *   `false`) are kept as-is, which MUI's `sx` array accepts.
 * - Input arrays are never mutated.
 *
 * Docs: [mergeSx](https://mui-components-docs.vercel.app/v1/form-helpers/mergeSx)
 */
export function mergeSx(...sources: SxInput[]): SxProps<Theme> {
  return sources.flatMap(sx => {
    if (Array.isArray(sx)) {
      return sx;
    }
    return sx ? [sx] : [];
  });
}
