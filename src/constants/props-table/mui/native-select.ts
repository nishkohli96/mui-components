import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUINativeSelect`. */
const nativeSelectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_NativeSelect,
  P.onValueChange_NativeSelect,
  P.options,
  P.labelKey,
  P.valueKey,
  P.getOptionDisabled,
  P.label,
  P.showLabelAboveFormField_Default,
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

export default nativeSelectRows;
