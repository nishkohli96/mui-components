import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIMultiAutocompleteObject`. */
const multiAutocompleteObjectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.ref_Autocomplete,
  P.value_MultiAutocompleteObject,
  P.onValueChange_MultiAutocompleteObject,
  P.options_Obj,
  P.labelKey_Obj,
  P.valueKey_Obj,
  P.disableClearable,
  P.selectAllText,
  P.hideSelectAllOption,
  P.renderOptionLabel_MultiAutocomplete,
  P.getOptionDisabled,
  P.limitTags,
  P.getLimitTagsText,
  resolveProp(P.textFieldProps, args),
  resolveProp(P.checkboxProps, args),
  resolveProp(P.formControlLabelProps, args),
  resolveProp(P.ChipProps, args),
  resolveProp(P.circularProgressProps, args),
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

export default multiAutocompleteObjectRows;
