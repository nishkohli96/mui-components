import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIColorPicker`. */
const colorPickerRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_ColorPicker,
  P.onValueChange_ColorPicker,
  P.valueKey_ColorPicker,
  {
    name: 'defaultColor',
    description: 'Initial color used by the picker when `value` is empty.\n\n**Default:** `\'#000000\'`',
    type: 'string'
  },
  {
    name: 'excludeAlpha',
    description: 'When true, omits alpha from emitted color values.',
    type: 'boolean'
  },
  {
    name: 'height',
    description: 'Height, in pixels, of the color picker control.\n\n**Default:** `200`',
    type: 'number'
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
  resolveProp(P.formLabelProps, args),
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default colorPickerRows;
