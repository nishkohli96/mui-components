import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/**
 * Every picker family ships four variants. The responsive, desktop and
 * mobile variants share one props surface (built by `pickerRows`); the
 * static variant renders inline without a text field (`staticPickerRows`).
 * Only the `onValueChange` description differs between families.
 */
export const pickerRows = (onValueChange: PropsInfo): PropsInfo[] => [
  P.fieldName,
  P.value_Picker,
  onValueChange,
  P.required,
  P.showLabelAboveFormField,
  P.formLabelProps,
  P.hideLabel,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.formHelperTextProps,
  P.pickerSlotProps,
  P.customIds
];

export const staticPickerRows = (onValueChange: PropsInfo): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_Picker,
  onValueChange,
  P.required,
  P.label,
  P.showLabelAboveFormField_Static,
  P.formLabelProps,
  P.hideLabel,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.formHelperTextProps,
  P.pickerSlotProps,
  P.customIds
];
