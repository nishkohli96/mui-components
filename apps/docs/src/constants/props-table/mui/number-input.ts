import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUINumberInput`. */
const numberInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_NumberInput,
  P.onValueChange_NumberInput,
  {
    name: 'nonNegative',
    description: 'When true, negative values cannot be entered.',
    type: 'boolean'
  },
  {
    name: 'onlyIntegers',
    description:
      'When true, decimal input is not allowed. Cannot be combined with `maxDecimalPlaces`.',
    type: 'boolean'
  },
  {
    name: 'maxDecimalPlaces',
    description:
      'Maximum number of decimal places accepted while typing.',
    type: 'number'
  },
  {
    name: 'stepAmount',
    description:
      'Amount the value changes on Arrow Up/Down key presses.',
    type: 'number'
  },
  {
    name: 'showMarkers',
    description:
      'When true, shows increment/decrement markers on the input.',
    type: 'boolean'
  },
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
