import type { PropsInfo, MuiPropsDescriptionArgs, DocsVersion } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUIPhoneInput`. */
const phoneInputRows = (
  args: MuiPropsDescriptionArgs,
  docsVersion?: DocsVersion
): PropsInfo[] => {
  const v1 = docsVersion === 1;
  return [
    P.fieldName,
    P.value_PhoneInput,
    P.onValueChange_PhoneInput,
    P.phoneInputProps,
    P.searchCountryProps,
    ...(!v1
      ? [resolveProp(P.countrySelectProps, args)]
      : []
    ),
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
};

export default phoneInputRows;
