import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUICounterInput`. */
const counterInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_NumberInput,
  P.onValueChange_NumberInput,
  P.min_CounterInput,
  P.max_CounterInput,
  P.nonNegative,
  P.onlyIntegers,
  P.maxDecimalPlaces,
  P.stepAmount,
  P.decrementIcon_CounterInput,
  P.incrementIcon_CounterInput,
  P.swapButtons_CounterInput,
  P.iconButtonProps_CounterInput,
  P.caption_CounterInput,
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

export default counterInputRows;
