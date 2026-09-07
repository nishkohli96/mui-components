import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIUnitInput`. */
const unitInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_UnitInput,
  P.value_UnitInput,
  P.onValueChange_UnitInput,
  P.unitOptions_UnitInput,
  P.labelKey_UnitInput,
  P.valueKey_UnitInput,
  P.unitPosition_UnitInput,
  P.unitWidth_UnitInput,
  P.unitSelectProps_UnitInput,
  P.quantityInputProps_UnitInput,
  P.onlyIntegers,
  P.nonNegative,
  P.maxDecimalPlaces,
  P.min_UnitInput,
  P.max_UnitInput,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.placeholder_UnitInput,
  P.required,
  P.disabled,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds_UnitInput,
];

export default unitInputRows;
