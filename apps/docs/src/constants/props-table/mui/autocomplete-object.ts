import type { PropsInfo, MuiPropsDescriptionArgs, DocsVersion } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUIAutocompleteObject`. */
const autocompleteObjectRows = (
  args: MuiPropsDescriptionArgs,
  docsVersion?: DocsVersion
): PropsInfo[] => {
  const v1 = docsVersion === 1;
  return [
    P.fieldName,
    P.ref_Autocomplete,
    P.options_Obj,
    P.labelKey_Obj,
    P.valueKey_Obj,
    P.value_AutocompleteObject,
    P.onValueChange_AutocompleteObject,
    P.multiple,
    P.disableClearable,
    P.limitTags,
    P.getLimitTagsText,
    resolveProp(P.textFieldProps, args),
    resolveProp(P.ChipProps, args),
    ...(!v1
      ? [resolveProp(P.circularProgressProps, args)]
      : []
    ),
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
};
export default autocompleteObjectRows;
