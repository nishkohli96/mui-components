import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUITextField`. */
const textFieldRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Input,
  P.onValueChange_Inputs,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default textFieldRows;
