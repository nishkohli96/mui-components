'use client';

import {
  useContext,
  type FocusEvent,
  type ReactNode,
  type ChangeEvent
} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type FormLabelProps,
  type FormHelperTextProps,
  type FormControlLabelProps,
  type CheckboxProps,
  type OptionValue
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { StrNumObjOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  coerceValue,
  getOptionValue,
  useFieldIds,
  resolveLabelAboveControl
} from '@/utils';

type OnValueChangeProps<
  Option extends StrNumObjOption = StrNumObjOption,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >
> = {
  event: ChangeEvent<HTMLInputElement>;
  newValue: OptionValue<Option, ValueKey>[];
  toggledValue: OptionValue<Option, ValueKey>;
  checked: boolean;
};

export type MUICheckboxGroupProps<
  Option extends StrNumObjOption = StrNumObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Currently checked option values. This is a controlled component: `value` and
   * `onValueChange` must be supplied together, typically backed by your own state
   * or form library. `undefined` or `[]` is treated as an empty selection.
   */
  value?: OptionValue<Option, ValueKey>[];
  /**
   * Called on every toggle with the next array of checked option values, the
   * toggled option, its next checked state, and the original change event.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param event - Original checkbox change event.
   * @param newValue - Next checkbox group array value.
   * @param toggledValue - Option value for the checkbox that was toggled.
   * @param checked - Checked state after the toggle.
   */
  onValueChange: ({
    event,
    newValue,
    toggledValue,
    checked
  }: OnValueChangeProps<Option, ValueKey>) => void;
  /**
   * List of options to render as checkboxes. Best suited for smaller datasets, with
   * upto 10 options. For larger datasets, consider using `MUIMultiAutocomplete`.
   */
  options: Option[];
  /**
   * Object key used to read the display label from each option.
   */
  labelKey?: LabelKey;
  /**
   * Object key used to derive the stored field value when options are an array of objects.
   */
  valueKey?: ValueKey;
  /**
   * Function to customize the label for each checkbox.
   * When not provided, the option label derived from `labelKey` (or the
   * option value itself for primitive options) is rendered.
   *
   * @param option - The option being rendered.
   * @returns Custom React content to display for the option.
   */
  renderOptionLabel?: (option: Option) => ReactNode;
  /**
   * Function to dynamically disable specific option(s).
   *
   * Return `true` to disable the option and prevent it from being checked.
   *
   * @param option - The option being evaluated.
   */
  getOptionDisabled?: (option: Option) => boolean;
  /**
   * When true, disables the field and associated controls.
   */
  disabled?: boolean;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Whether the field label renders above the checkbox group. The group has no
   * built-in inline label, so this defaults to `true`; pass `false` to hide the
   * visible label (the accessible name is still applied).
   *
   * @default true
   */
  showLabelAboveFormField?: boolean;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: Omit<FormLabelProps, 'id'>;
  /**
   * When true, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * Props to pass down to each Checkbox component. Can be used to set
   * a custom color, size, etc. for all checkboxes in the group.
   */
  checkboxProps?: CheckboxProps;
  /**
   * Props forwarded to each internal MUI `FormControlLabel`.
   */
  formControlLabelProps?: FormControlLabelProps;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Error message for the field. Any non-empty string puts the field into an error state
   * (surfaced through `FormHelperText`). Pass `undefined` or `null` to clear the error state.
   *
   * Use `renderError` to customize how this message is rendered.
   */
  errorMessage?: string | null;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string and must return
   * renderable content, e.g. wrapping it with an icon or a styled element.
   *
   * @param error - Current `errorMessage` for this checkbox group.
   */
  renderError?: (error: string) => ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Helper text shown below the field when there is no visible validation error.
   */
  helperText?: ReactNode;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * Callback fired when focus leaves the checkbox group.
   */
  onBlur?: (event: FocusEvent<HTMLDivElement, Element>) => void;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

const MUICheckboxGroup = <
  Option extends StrNumObjOption = StrNumObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
>({
  fieldName,
  value,
  onValueChange,
  options,
  labelKey,
  valueKey,
  renderOptionLabel,
  getOptionDisabled,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  checkboxProps,
  formControlLabelProps,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  onBlur,
  customIds
}: MUICheckboxGroupProps<Option, LabelKey, ValueKey>) => {
  const {
    defaultFormControlLabelSx,
    allLabelsAboveFields
  } = useContext(MUIComponentsConfigContext);

  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const isLabelAboveControl = resolveLabelAboveControl(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

  const { sx, ...otherFormControlLabelProps } = formControlLabelProps ?? {};
  const appliedFormControlLabelSx = {
    ...defaultFormControlLabelSx,
    ...sx
  };

  const checkedValues = value ?? [];
  const isError = !!errorMessage;
  const fieldErrorMessage = isError
    ? renderError?.(errorMessage) ?? errorMessage
    : undefined;
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
    optionValue: OptionValue<Option, ValueKey>
  ) => {
    const normalizedValue = coerceValue(event.target.value, optionValue);
    const newValue = checked
      ? checkedValues.includes(normalizedValue)
        ? checkedValues
        : [...checkedValues, normalizedValue]
      : checkedValues.filter(v => v !== normalizedValue);
    onValueChange({
      toggledValue: normalizedValue,
      newValue,
      event,
      checked
    });
  };

  return (
    <FormControl
      component="fieldset"
      aria-labelledby={!hideLabel ? labelId : undefined}
      aria-label={hideLabel ? accessibleFieldLabel : undefined}
      error={isError}
      disabled={muiDisabled}
      /**
       * Trigger blur event only if focus is moving OUTSIDE
       * the checkbox group, instead of calling onBlur for
       * every checkbox.
       */
      onBlur={e => {
        const currentTarget = e.currentTarget;
        const relatedTarget = e.relatedTarget as Node | null;
        if (!currentTarget.contains(relatedTarget)) {
          onBlur?.(e);
        }
      }}
    >
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveControl}
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            component: 'legend'
          }}
        />
      )}
      {options.map((option, idx) => {
        const isObject = isKeyValueOption(option, labelKey, valueKey);
        const opnValue = getOptionValue<Option, ValueKey>(
          option,
          valueKey
        );
        const opnLabel = isObject
          ? String(option[labelKey!])
          : String(option);
        const checked = checkedValues.includes(opnValue);
        const isOptionDisabled
          = muiDisabled || getOptionDisabled?.(option) || false;
        return (
          <FormControlLabel
            {...otherFormControlLabelProps}
            key={`${opnValue}-${idx}`}
            control={
              <Checkbox
                {...checkboxProps}
                id={`${fieldId}-${opnValue}`}
                name={fieldName}
                value={opnValue}
                checked={checked}
                disabled={isOptionDisabled}
                onChange={e =>
                  handleChange(e, e.target.checked, opnValue)}
              />
            }
            label={renderOptionLabel?.(option) ?? opnLabel}
            sx={appliedFormControlLabelSx}
            disabled={isOptionDisabled}
          />
        );
      })}
      <FormHelperText
        error={isError}
        errorMessage={fieldErrorMessage}
        hideErrorMessage={hideErrorMessage}
        helperText={helperText}
        showHelperTextElement={showHelperTextElement}
        formHelperTextProps={{
          ...formHelperTextProps,
          id: isError ? errorId : helperTextId
        }}
      />
    </FormControl>
  );
};

export default MUICheckboxGroup;
