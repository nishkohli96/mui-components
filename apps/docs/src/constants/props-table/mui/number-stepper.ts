import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUINumberStepper`. */
const numberStepperRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_NumberInput,
  P.onValueChange_NumberInput,
  P.min_NumberStepper,
  P.max_NumberStepper,
  P.nonNegative,
  P.onlyIntegers,
  P.maxDecimalPlaces,
  P.stepAmount,
  P.decrementIcon_NumberStepper,
  P.incrementIcon_NumberStepper,
  P.swapButtons_NumberStepper,
  P.iconButtonProps_NumberStepper,
  P.caption_NumberStepper,
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

export default numberStepperRows;
