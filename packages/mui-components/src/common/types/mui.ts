import type { FormLabelProps as MuiFormLabelProps } from '@mui/material/FormLabel';
import type { FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material/FormControlLabel';
import type { FormHelperTextProps as MuiFormHelperTextProps } from '@mui/material/FormHelperText';
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import type { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import type { SelectProps as MuiSelectProps } from '@mui/material/Select';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import type { ChipProps } from '@mui/material/Chip';
import type { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import type { InputLabelProps as MuiInputLabelProps } from '@mui/material/InputLabel';
import type { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import type { CircularProgressProps as MuiCircularProgressProps } from '@mui/material/CircularProgress';
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
 * Props forwarded to each internal MUI `MenuItem` (e.g. `MUISelect`'s options).
 * `key`, `value`, `disabled` and `children` are omitted because the component
 * derives them per-option from `options`/`getOptionDisabled`/`renderOptionLabel`.
 */
export type MenuItemProps = Omit<
  MuiMenuItemProps,
  | 'key'
  | 'value'
  | 'disabled'
  | 'children'
>;

/**
 * Props forwarded to an internal MUI `InputLabel` (e.g. `MUISelect`'s inline
 * label). `id`, `htmlFor`, `shrink`, `disabled` and `children` are omitted
 * because the component manages them to keep the label wired to the field.
 */
export type InputLabelProps = Omit<
  MuiInputLabelProps,
  | 'id'
  | 'htmlFor'
  | 'shrink'
  | 'disabled'
  | 'children'
>;

/**
 * Props forwarded to an internal MUI `CircularProgress` (the Autocomplete
 * family's loading spinner). Nothing is omitted — `color`/`size` have sane
 * defaults but are safe to override.
 */
export type CircularProgressProps = MuiCircularProgressProps;

/**
 * Props forwarded to an internal MUI `IconButton` (e.g. `MUIPasswordInput`'s
 * show/hide toggle). The interaction/accessibility essentials are omitted
 * because the component owns them — `type`, `onClick`, `onMouseDown`, `edge`,
 * `disabled`, `aria-label` and `children` are always set correctly regardless
 * of what's passed here.
 */
export type IconButtonProps = Omit<
  MuiIconButtonProps,
  | 'type'
  | 'onClick'
  | 'onMouseDown'
  | 'edge'
  | 'disabled'
  | 'aria-label'
  | 'children'
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
