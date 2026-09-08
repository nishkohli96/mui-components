import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUITipTapRte`. */
const tipTapRteRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_TipTapRte,
  P.onValueChange_TipTapRte,
  P.placeholder_TipTapRte,
  P.editorExtensions_TipTapRte,
  P.onReady_TipTapRte,
  P.onFocus_TipTapRte,
  P.onBlur_TipTapRte,
  P.required,
  P.disabled,
  P.label,
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default tipTapRteRows;
