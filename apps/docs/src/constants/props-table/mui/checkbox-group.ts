import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUICheckboxGroup`. */
const checkboxGroupRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_CheckboxGroup,
  P.onValueChange_CheckboxGroup,
  P.options,
  P.labelKey,
  P.valueKey,
  P.renderOptionLabel,
  P.getOptionDisabled,
  resolveProp(P.checkboxProps, args),
  resolveProp(P.formControlLabelProps, args),
  P.label,
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default checkboxGroupRows;
