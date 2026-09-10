import type { PropsInfo, MuiPropsDescriptionArgs, DocsVersion } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';
import { PropsDescription_v1 as Pv1 } from '../descriptions/v1';

/** Props reference rows for `MUINumberInput`. */
const numberInputRows = (
  args: MuiPropsDescriptionArgs,
  docsVersion?: DocsVersion
): PropsInfo[] => {
  const v1 = docsVersion === 1;
  return [
    P.fieldName,
    P.value_NumberInput,
    P.onValueChange_NumberInput,
    ...(!v1
      ? [
        P.min_NumberInput,
        P.max_NumberInput
      ]
      : [
        Pv1.min_NumberInput,
        Pv1.max_NumberInput
      ]
    ),
    P.nonNegative,
    P.onlyIntegers,
    P.maxDecimalPlaces,
    P.stepAmount,
    ...(!v1
      ? [P.renderValue_NumberInput]
      : [Pv1.renderValue_NumberInput]
    ),
    P.showMarkers,
    P.label,
    resolveProp(P.showLabelAboveFormField, args),
    resolveProp(P.formLabelProps, args),
    P.hideLabel,
    P.required,
    P.errorMessage,
    P.renderError,
    P.hideErrorMessage,
    resolveProp(P.formHelperTextProps, args),
    P.customIds
  ];
};

export default numberInputRows;
