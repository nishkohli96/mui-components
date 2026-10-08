import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUITextArea`. */
const textAreaRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Input,
  P.onValueChange_Inputs,
  P.maxChars_TextArea,
  P.showCharLimit_TextArea,
  P.renderCharLimit_TextArea,
  P.rows_TextArea,
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

export default textAreaRows;
