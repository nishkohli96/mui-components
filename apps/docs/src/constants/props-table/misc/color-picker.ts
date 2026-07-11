import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUIColorPicker`. */
const colorPickerRows: PropsInfo[] = [
  P.fieldName_NoName,
  P.value_ColorPicker,
  P.onValueChange_ColorPicker,
  P.valueKey_ColorPicker,
  {
    name: 'defaultColor',
    description: 'Initial color used by the picker when `value` is empty.',
    type: 'string',
    defaultValue: '\'#000000\''
  },
  {
    name: 'excludeAlpha',
    description: 'When true, omits alpha from emitted color values.',
    type: 'boolean'
  },
  {
    name: 'height',
    description: 'Height, in pixels, of the color picker control.',
    type: 'number',
    defaultValue: '200'
  },
  {
    name: 'hideAlpha',
    description: 'When true, hides alpha controls in the color picker.',
    type: 'boolean'
  },
  {
    name: 'hideInput',
    description:
      'Hides picker input fields rendered by `react-color-palette`.',
    type: '(keyof IColor)[] | boolean'
  },
  P.required,
  P.label,
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  P.formLabelProps,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.formHelperTextProps,
  P.customIds
];

export default colorPickerRows;
