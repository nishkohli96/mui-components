import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUINativeSelect`. */
const nativeSelectRows: PropsInfo[] = [
  P.fieldName,
  P.value_NativeSelect,
  P.onValueChange_NativeSelect,
  P.options,
  P.labelKey,
  P.valueKey,
  P.getOptionDisabled,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  P.formLabelProps,
  P.formHelperTextProps,
  P.customIds
];

export default nativeSelectRows;
