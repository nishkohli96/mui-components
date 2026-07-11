import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUIPasswordInput`. */
const passwordInputRows: PropsInfo[] = [
  P.fieldName,
  P.value_Input,
  P.onValueChange_Inputs,
  {
    name: 'showPasswordIcon',
    description:
      'Custom icon displayed when the password is currently hidden. Clicking it reveals the password value.',
    type: 'ReactNode',
    defaultValue: '`<VisibilityIcon />`'
  },
  {
    name: 'hidePasswordIcon',
    description:
      'Custom icon displayed when the password is currently visible. Clicking it hides the password value.',
    type: 'ReactNode',
    defaultValue: '`<VisibilityOffIcon />`'
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

export default passwordInputRows;
