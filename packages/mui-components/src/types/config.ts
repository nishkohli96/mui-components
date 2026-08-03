import type { SxProps, Theme } from '@mui/system';

export type MuiPickersAdapter = new (...args: any) => any;

export type MUIComponentsConfig = {
  defaultFormLabelSx: SxProps<Theme>;
  defaultFormControlLabelSx: SxProps<Theme>;
  defaultFormHelperTextSx: SxProps<Theme>;
  dateAdapter?: MuiPickersAdapter;
  allLabelsAboveFields?: boolean;
};

export type MUIComponentsConfigInput = Partial<MUIComponentsConfig>;
