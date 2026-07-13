import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIAutocomplete`. */
const autocompleteRows = (args: PropsDescriptionArgs): PropsInfo[] => [
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
  resolveProp(P.textFieldProps, args),
  resolveProp(P.ChipProps, args),
  P.required,
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

export default autocompleteRows;
