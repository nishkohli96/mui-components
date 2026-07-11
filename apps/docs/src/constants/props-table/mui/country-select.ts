import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUICountrySelect`. */
const countrySelectRows: PropsInfo[] = [
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

export default countrySelectRows;
