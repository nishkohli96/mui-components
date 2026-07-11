import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUISelect`. */
const selectRows: PropsInfo[] = [
  P.fieldName,
  P.value_Select,
  P.onValueChange_Select,
  P.options,
  P.labelKey,
  P.valueKey,
  P.renderOptionLabel,
  P.getOptionDisabled,
  P.multiple,
  P.showDefaultOption,
  P.defaultOptionText,
  P.placeholder_Select,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.showLabelAboveFormField,
  P.hideLabel,
  P.formLabelProps,
  P.formHelperTextProps,
  P.customIds
];

export default selectRows;
