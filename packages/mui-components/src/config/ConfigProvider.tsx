import { createContext, useMemo, type ReactNode } from 'react';
import type { MUIComponentsConfig, MUIComponentsConfigInput } from '@/types';
import { DefaultMUIComponentsConfig } from './DefaultConfig';

type ConfigProviderProps = {
  children: ReactNode;
} & MUIComponentsConfigInput;

export const MUIComponentsConfigContext
  = createContext<MUIComponentsConfig>(DefaultMUIComponentsConfig);

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
