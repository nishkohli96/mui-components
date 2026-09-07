import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIUnitInput`. */
const unitInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_UnitInput,
  P.value_UnitInput,
  P.onValueChange_UnitInput,
  P.units_UnitInput,
  P.unitPosition_UnitInput,
  P.placeholder_UnitInput,
  P.onlyIntegers,
  P.nonNegative,
  P.maxDecimalPlaces,
  P.min_NumberInput,
  P.max_NumberInput,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.required,
  P.disabled,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds_UnitInput,
  P.quantityInputProps_UnitInput,
  P.unitSelectProps_UnitInput
];

export default unitInputRows;
