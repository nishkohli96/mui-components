import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIPasswordInput`. */
const passwordInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Input,
  P.onValueChange_Inputs,
  {
    name: 'showPasswordIcon',
    description:
      'Custom icon displayed when the password is currently hidden. Clicking it reveals the password value.\n\n**Default:** `<VisibilityIcon />`',
    type: 'ReactNode'
  },
  {
    name: 'hidePasswordIcon',
    description:
      'Custom icon displayed when the password is currently visible. Clicking it hides the password value.\n\n**Default:** `<VisibilityOffIcon />`',
    type: 'ReactNode'
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

export default passwordInputRows;
