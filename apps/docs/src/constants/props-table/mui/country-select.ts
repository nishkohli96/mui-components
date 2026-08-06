import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUICountrySelect`. */
const countrySelectRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.ref_Autocomplete,
  P.value_CountrySelect,
  P.onValueChange_CountrySelect,
  P.countries,
  P.preferredCountries,
  P.valueKey_CountrySelect,
  P.multiple,
  P.disableClearable,
  P.renderOptionLabel_CountrySelect,
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

export default countrySelectRows;
