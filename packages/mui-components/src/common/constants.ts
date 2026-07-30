/**
 * Default value for the `autoComplete` prop in MUI input
 * components to disable browser autocomplete and autofill.
 * Let the developer override this value by passing their own
 * `autoComplete` prop to the TextField component.
 */
export const defaultAutocompleteValue = 'off';

/**
 * Default value for the select all option in MUIMultiAutocomplete
 * and MUIMultiAutocompleteObject components.
 */
export const selectAllOptionValue = '__ALL__';
export const defaultSelectAllOptionLabel = 'Select All';

/**
 * Threshold for the maximum number of options to use MUISelect and
 * MUINativeSelect for.
 * If the number of options exceeds this threshold, advise the developer
 * to use `MUIAutocomplete` or `MUIMuiAutocomplete` instead.
 */
export const MUISELECT_OPTIONS_THRESHOLD = 20;
