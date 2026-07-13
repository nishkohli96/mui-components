import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/**
 * Every picker family ships four variants. The responsive, desktop and
 * mobile variants share one props surface (built by `pickerRows`); the
 * static variant renders inline without a text field (`staticPickerRows`).
 * Only the `onValueChange` description differs between families.
 */
export const pickerRows = (onValueChange: PropsInfo) => (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Picker,
  onValueChange,
  P.required,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  resolveProp(P.pickerSlotProps, args),
  P.customIds
];

export const staticPickerRows = (onValueChange: PropsInfo) => (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_Picker,
  onValueChange,
  P.required,
  P.label,
  P.showLabelAboveFormField_Static,
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  resolveProp(P.pickerSlotProps, args),
  P.customIds
];
