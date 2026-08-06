import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUISelect`. */
const selectRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Select,
  P.onValueChange_Select,
  P.options,
  P.labelKey,
  P.valueKey,
  P.renderOptionLabel,
  P.getOptionDisabled,
  resolveProp(P.menuItemProps, args),
  P.multiple,
  P.showDefaultOption,
  P.defaultOptionText,
  P.placeholder_Select,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  resolveProp(P.inputLabelProps, args),
  P.hideLabel,
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default selectRows;
