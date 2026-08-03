import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIAutocompleteObject`. */
const autocompleteObjectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.ref_Autocomplete,
  P.value_AutocompleteObject,
  P.onValueChange_AutocompleteObject,
  P.options_Obj,
  P.labelKey_Obj,
  P.valueKey_Obj,
  P.multiple,
  P.disableClearable,
  P.limitTags,
  P.getLimitTagsText,
  resolveProp(P.textFieldProps, args),
  resolveProp(P.ChipProps, args),
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
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

export default autocompleteObjectRows;
