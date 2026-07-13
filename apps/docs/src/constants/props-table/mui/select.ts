import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUISelect`. */
const selectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
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
  resolveProp(P.helperText, args),
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default selectRows;
