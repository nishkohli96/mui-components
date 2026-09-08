import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUITipTapRte`. */
const tipTapRteRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_TipTapRte,
  P.onValueChange_TipTapRte,
  P.editorOptions_TipTapRte,
  P.editorExtensions_TipTapRte,
  P.containerProps_TipTapRte,
  P.contentContainerProps_TipTapRte,
  P.renderToolbar_TipTapRte,
  P.required,
  P.placeholder_TipTapRte,
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
