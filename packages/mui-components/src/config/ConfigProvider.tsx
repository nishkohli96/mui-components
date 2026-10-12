import { createContext, useMemo, type ReactNode } from 'react';
import type { MUIComponentsConfig, MUIComponentsConfigInput } from '@/types';
import { mergeSx } from '@/utils';
import { DefaultMUIComponentsConfig } from './DefaultConfig';

type ConfigProviderProps = {
  children: ReactNode;
} & MUIComponentsConfigInput;

export const MUIComponentsConfigContext
  = createContext<MUIComponentsConfig>(DefaultMUIComponentsConfig);

/**
 * Context provider that sets shared defaults for all `MUI*` components
 * mounted beneath it, including default `sx` overrides for `FormLabel`,
 * `FormControlLabel`, and `FormHelperText`, a shared `dateAdapter` for
 * all pickers, and whether field labels render above their controls by default.
 *
 * Each config key is merged on top of `DefaultMUIComponentsConfig`, so you
 * only need to pass the keys you want to override. The `sx` keys accept an
 * object, a theme callback or an array of those, and are merged with `mergeSx`
 * so none of those forms lose their styles.
 *
 * Docs: [Customization](https://mui-components-docs.vercel.app/customization)
 */
export const ConfigProvider = ({
  children,
  defaultFormHelperTextSx,
  defaultFormControlLabelSx,
  defaultFormLabelSx,
  dateAdapter,
  allLabelsAboveFields
}: ConfigProviderProps) => {
  const defaultSetting: MUIComponentsConfig = useMemo(
    () => ({
      defaultFormLabelSx: mergeSx(
        DefaultMUIComponentsConfig.defaultFormLabelSx,
        defaultFormLabelSx
      ),
      defaultFormControlLabelSx: mergeSx(
        DefaultMUIComponentsConfig.defaultFormControlLabelSx,
        defaultFormControlLabelSx
      ),
      defaultFormHelperTextSx: mergeSx(
        DefaultMUIComponentsConfig.defaultFormHelperTextSx,
        defaultFormHelperTextSx
      ),
      dateAdapter,
      allLabelsAboveFields,
    }),
    [
      defaultFormHelperTextSx,
      defaultFormControlLabelSx,
      defaultFormLabelSx,
      dateAdapter,
      allLabelsAboveFields,
    ],
  );

  return (
    <MUIComponentsConfigContext.Provider value={defaultSetting}>
      {children}
    </MUIComponentsConfigContext.Provider>
  );
};
