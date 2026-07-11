import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUIAutocomplete`. */
const autocompleteRows: PropsInfo[] = [
  P.fieldName,
  P.value_Autocomplete,
  P.onValueChange_Autocomplete,
  P.options_StrOrObj,
  P.labelKey,
  P.valueKey,
  P.multiple,
  P.disableClearable,
  P.freeSolo,
  P.limitTags,
  P.getLimitTagsText,
  P.textFieldProps,
  P.ChipProps,
  P.required,
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

export default autocompleteRows;
