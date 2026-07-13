import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUINumberInput`. */
const numberInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_NumberInput,
  P.onValueChange_NumberInput,
  P.nonNegative,
  P.onlyIntegers,
  P.maxDecimalPlaces,
  P.stepAmount,
  P.showMarkers,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default numberInputRows;
