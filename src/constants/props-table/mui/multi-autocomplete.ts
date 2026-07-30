import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIMultiAutocomplete`. */
const multiAutocompleteRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_MultiAutocomplete,
  P.onValueChange_MultiAutocomplete,
  P.options_StrOrObj,
  P.labelKey,
  P.valueKey,
  P.freeSolo_MultiAutocomplete,
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

export default multiAutocompleteRows;
