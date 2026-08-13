import type { MUIComponentsConfig } from '@/types';

const DefaultStyles = Object.freeze({
  margin: {
    top: '0.25rem',
    bottom: '0.75rem',
    left: 0
  },
});

/**
 * Baseline `MUIComponentsConfig` every `MUI*` component falls back to when
 * no `ConfigProvider` is mounted, or a given config key is left unset.
 *
 * Only supplies default `sx` overrides for `FormLabel`/`FormControlLabel`/
 * `FormHelperText` spacing — `dateAdapter` and `allLabelsAboveFields` have
 * no default and stay `undefined` until a `ConfigProvider` sets them.
 *
 * Docs: [Customization](https://mui-components-docs.vercel.app/customization)
 */
export const DefaultMUIComponentsConfig: MUIComponentsConfig = {
  defaultFormLabelSx: { mb: DefaultStyles.margin.bottom },
  defaultFormControlLabelSx: {},
  defaultFormHelperTextSx: {
    mt: DefaultStyles.margin.top,
    ml: DefaultStyles.margin.left
  },
};
