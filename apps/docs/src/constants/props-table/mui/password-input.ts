import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIPasswordInput`. */
const passwordInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Input,
  P.onValueChange_Inputs,
  P.showPasswordIcon,
  P.hidePasswordIcon,
  P.readOnly_PasswordInput,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default passwordInputRows;
