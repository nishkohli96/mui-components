import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUICountrySelect`. */
const countrySelectRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_CountrySelect,
  P.onValueChange_CountrySelect,
  {
    name: 'countries',
    description:
      'List of countries to display in the country selector. Defaults to all countries from `countryList`.',
    type: 'CountryDetails[]'
  },
  {
    name: 'preferredCountries',
    description:
      'Country ISO codes pinned at the top of the dropdown, in the provided order.',
    type: 'CountryISO[]'
  },
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
