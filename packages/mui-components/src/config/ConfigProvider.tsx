import { createContext, useMemo, type ReactNode } from 'react';
import type { MUIComponentsConfig, MUIComponentsConfigInput } from '@/types';
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
 * only need to pass the keys you want to override.
 *
 * Docs: [Customization](https://mui-components-docs.vercel.app/v1/customization)
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
      defaultFormLabelSx: {
        ...DefaultMUIComponentsConfig.defaultFormLabelSx,
        ...defaultFormLabelSx
      },
      defaultFormControlLabelSx: {
        ...DefaultMUIComponentsConfig.defaultFormControlLabelSx,
        ...defaultFormControlLabelSx
      },
      defaultFormHelperTextSx: {
        ...DefaultMUIComponentsConfig.defaultFormHelperTextSx,
        ...defaultFormHelperTextSx
      },
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
