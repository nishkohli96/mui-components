import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUICountrySelect`. */
const countrySelectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
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

export default countrySelectRows;
