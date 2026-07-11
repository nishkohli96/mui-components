import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUINumberInput`. */
const numberInputRows: PropsInfo[] = [
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
  P.showLabelAboveFormField,
  P.hideLabel,
  P.formLabelProps,
  P.formHelperTextProps,
  P.customIds
];

export default numberInputRows;
