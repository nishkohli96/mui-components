import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUIPhoneInput`. */
const phoneInputRows: PropsInfo[] = [
  P.fieldName,
  P.value_PhoneInput,
  P.onValueChange_PhoneInput,
  {
    name: 'phoneInputProps',
    description:
      'Configuration passed to `react-international-phone`\'s `usePhoneInput` hook — `defaultCountry`, `countries`, `preferredCountries`, `forceDialCode`, etc.',
    type: 'UsePhoneInputConfig'
  },
  {
    name: 'searchCountryProps',
    description:
      'Options for the inline country search field in the country dropdown — `allowCountrySearch`, `textFieldProps`, `renderCountryMenuItem`, `noCountryFoundText`.',
    type: 'SearchCountryProps'
  },
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

export default phoneInputRows;
