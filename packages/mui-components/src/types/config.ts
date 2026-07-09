import type { SxProps } from '@mui/system';

export type MuiPickersAdapter = new (...args: any) => any;

export type MUIComponentsConfig = {
  defaultFormLabelSx: SxProps;
  defaultFormControlLabelSx: SxProps;
  defaultFormHelperTextSx: SxProps;
  dateAdapter?: MuiPickersAdapter;
  allLabelsAboveFields?: boolean;
};

export type MUIComponentsConfigInput = Partial<MUIComponentsConfig>;
