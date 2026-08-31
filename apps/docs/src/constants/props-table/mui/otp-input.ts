import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUIOTPInput`. */
const otpInputRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_OTPInput,
  P.onValueChange_OTPInput,
  P.length_OTPInput,
  P.separatorIndexes,
  P.separator,
  P.alphanumeric,
  resolveProp(P.textFieldProps_OTPInput, args),
  P.autoFocus_OTPInput,
  P.inputRef_OTPInput,
  P.label,
  resolveProp(P.showLabelAboveFormField_OTPInput, args),
  resolveProp(P.formLabelProps, args),
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
