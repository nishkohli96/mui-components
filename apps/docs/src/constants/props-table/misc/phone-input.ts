import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIPhoneInput`. */
const phoneInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
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
  resolveProp(P.helperText, args),
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default phoneInputRows;
