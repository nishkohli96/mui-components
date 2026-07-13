import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIRadioGroup`. */
const radioGroupRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_RadioGroup,
  P.onValueChange_RadioGroup,
  P.options,
  P.labelKey,
  P.valueKey,
  P.renderOptionLabel,
  P.getOptionDisabled,
  resolveProp(P.radioProps, args),
  resolveProp(P.formControlLabelProps, args),
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default radioGroupRows;
