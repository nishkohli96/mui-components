import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUIColorPicker`. */
const colorPickerRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_ColorPicker,
  P.onValueChange_ColorPicker,
  P.valueKey_ColorPicker,
  P.defaultColor,
  P.excludeAlpha,
  P.height_ColorPicker,
  P.hideAlpha,
  P.hideInput_ColorPicker,
  P.required,
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

export default colorPickerRows;
