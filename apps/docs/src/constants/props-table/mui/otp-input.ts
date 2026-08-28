import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIOTPInput`. */
const otpInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_OTPInput,
  P.onValueChange_OTPInput,
  P.length_OTPInput,
  P.separatorIndexes,
  P.separator,
  P.alphanumeric,
  resolveProp(P.textFieldProps_OTPInput, args),
  P.autoFocus_OTPInput,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.required,
  P.disabled,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default otpInputRows;
