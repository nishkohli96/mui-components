import type { PropsInfo, MuiPropsDescriptionArgs, DocsVersion } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';
import { PropsDescription_v1 as Pv1 } from '../descriptions/v1';

/** Props reference rows for `MUIUnitInput`. */
const unitInputRows = (
  args: MuiPropsDescriptionArgs,
  docsVersion?: DocsVersion
): PropsInfo[] => {
  const v1 = docsVersion === 1;
  return [
    P.fieldName_UnitInput,
    P.unitOptions_UnitInput,
    P.labelKey_UnitInput,
    P.valueKey_UnitInput,
    P.value_UnitInput,
    P.onValueChange_UnitInput,
    P.min_UnitInput,
    P.max_UnitInput,
    P.onlyIntegers,
    P.nonNegative,
    P.maxDecimalPlaces,
    P.stepAmount,
    P.renderValue_UnitInput,
    P.unitPosition_UnitInput,
    P.unitWidth_UnitInput,
    ...(!v1
      ? [P.unitSelectProps_UnitInput, P.valueInputProps_UnitInput]
      : [Pv1.unitSelectProps_UnitInput, Pv1.valueInputProps_UnitInput]),
    resolveProp(P.containerProps_UnitInput, args),
    resolveProp(P.dividerProps_UnitInput, args),
    P.label_UnitInput,
    resolveProp(P.showLabelAboveFormField, args),
    resolveProp(P.formLabelProps, args),
    P.hideLabel,
    P.required,
    P.placeholder_UnitInput,
    P.disabled,
    P.errorMessage,
    P.renderError,
    P.hideErrorMessage,
    resolveProp(P.helperText, args),
    resolveProp(P.formHelperTextProps, args),
    P.customIds_UnitInput
  ];
};

export default unitInputRows;
