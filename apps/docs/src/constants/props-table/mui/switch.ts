import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUISwitch`. */
const switchRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_Cbx_Switch,
  P.onValueChange_Cbx_Switch,
  P.label,
  P.hideLabel,
  resolveProp(P.formControlLabelProps, args),
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default switchRows;
