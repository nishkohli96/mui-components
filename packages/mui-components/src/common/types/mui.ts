import type { FormLabelProps as MuiFormLabelProps } from '@mui/material/FormLabel';
import type { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel';
import type { FormHelperTextProps as MuiFormHelperTextProps } from '@mui/material/FormHelperText';
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import type { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import type { SelectProps as MuiSelectProps } from '@mui/material/Select';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import type { ChipProps } from '@mui/material/Chip';
import type { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import type { OptionRenderState } from './components';

export type FormLabelProps = Omit<
  MuiFormLabelProps,
  | 'children'
  | 'required'
  | 'error'
>;

export type FormControlLabelProps = Omit<
  MuiFormControlLabelProps,
  | 'control'
  | 'label'
  | 'value'
  | 'defaultValue'
  | 'defaultChecked'
  | 'disabled'
  | 'key'
>;

export type FormHelperTextProps = Omit<
  MuiFormHelperTextProps,
  | 'children'
  | 'component'
  | 'error'
>;

export type TextFieldProps = Omit<
  MuiTextFieldProps,
  | 'id'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'error'
  | 'FormHelperTextProps'
  | 'ref'
>;

export type CheckboxProps = Omit<
  MuiCheckboxProps,
  | 'name'
  | 'value'
  | 'checked'
  | 'defaultChecked'
  | 'onChange'
>;

export type RadioProps = Omit<
  MuiRadioProps,
  | 'checked'
>;

export type SelectProps = Omit<
  MuiSelectProps,
  | 'name'
  | 'id'
  | 'labelId'
  | 'error'
  | 'onChange'
  | 'value'
  | 'defaultValue'
  | 'ref'
  | 'displayEmpty'
  | 'multiple'
>;

export type AutoCompleteTextFieldProps = Omit<
  MuiTextFieldProps,
  | 'value'
  | 'onChange'
  | 'disabled'
  | 'label'
  | 'required'
  | 'error'
  | 'ref'
  | 'inputRef'
>;

export type OmittedAutocompleteProps
  = | 'freeSolo'
    | 'fullWidth'
    | 'renderInput'
    | 'renderOption'
    | 'options'
    | 'value'
    | 'defaultValue'
    | 'multiple'
    | 'onChange'
    | 'getOptionKey'
    | 'getOptionLabel'
    | 'isOptionEqualToValue'
    | 'autoHighlight'
    | 'disableCloseOnSelect';

export type MuiChipProps = Omit<
  ChipProps,
  | 'key'
  | 'label'
  | 'onDelete'
  | 'disabled'
>;

/**
 * Per-option state for `renderOptionLabel` in the Autocomplete family
 * (country select, multi autocomplete). Extends MUI's option state — which
 * already carries `selected`, `index` and `inputValue` for the filtered
 * dropdown — with the shared `disabled` flag, so the `{ disabled, selected }`
 * core matches the form-control components' `OptionRenderState`.
 */
export type AutocompleteOptionRenderState
  = AutocompleteRenderOptionState & Pick<OptionRenderState, 'disabled'>;
