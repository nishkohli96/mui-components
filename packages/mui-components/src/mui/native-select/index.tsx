'use client';

import {
  useContext,
  type ReactNode,
  type ChangeEvent
} from 'react';
import FormControl from '@mui/material/FormControl';
import NativeSelect, {
  type NativeSelectProps
} from '@mui/material/NativeSelect';
import {
  FormLabel,
  FormHelperText,
  defaultAutocompleteValue,
  type FormHelperTextProps,
  type FormLabelProps,
  type OptionValue,
  type OptionRenderState
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds, StrNumObjOption } from '@/types';
import {
  fieldNameToLabel,
  getOptionValue,
  isKeyValueOption,
  normalizeSelectValue,
  useFieldIds,
  resolveLabelAboveControl,
  getErrorList
} from '@/utils';

type InputNativeSelectProps = Omit<
  NativeSelectProps,
  'name' | 'id' | 'labelId' | 'error' | 'onChange' | 'value' | 'ref'
>;

type OnValueChangeProps<
  Option extends StrNumObjOption = StrNumObjOption,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >
> = {
  newValue: OptionValue<Option, ValueKey>;
  event: ChangeEvent<HTMLSelectElement>;
};

export type MUINativeSelectProps<
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
   * List of options to display in the dropdown.
   * Note:
   * - Works best for small to moderate datasets.
   * - If options exceed ~20 items, `MUIAutocomplete` is
   *   recommended for improved searchability, keyboard navigation, and performance.
   */
  options: Option[];
  /**
   * Object key used to read the display label from each option.
   */
  labelKey?: LabelKey;
  /**
   * Object key used to derive the selected value when options are an array of objects.
   */
  valueKey?: ValueKey;
  /**
   * Custom renderer for dropdown options.
   *
   * Use this prop to customize how each option is displayed in the `<option>` element.
   * When not provided, the option label derived from `labelKey` (or the
   * option value itself for primitive options) is rendered.
   *
   * @param option - The option being rendered.
   * @returns Custom React content to display for the option.
   */
  /**
   * Current select value, normalized with `valueKey` for object options.
   * This is a controlled component: `value` and `onValueChange` must be
   * supplied together. `undefined`/`null` are treated as no selection.
   */
  value?: NoInfer<OptionValue<Option, ValueKey>> | null;
  /**
   * Called after the selected value is normalized using `valueKey` for object options.
   *
   * @param newValue - Normalized selected value.
   * @param event - Original native select change event.
   */
  onValueChange: ({
    newValue,
    event
  }: OnValueChangeProps<Option, ValueKey>) => void;
  renderOptionLabel?: (option: Option, state: OptionRenderState) => ReactNode;
  /**
   * Function to dynamically disable specific option(s).
   *
   * Return `true` to disable the option and prevent it from being selected.
   *
   * @param option - The option being evaluated.
   */
  getOptionDisabled?: (option: Option) => boolean;
  /**
   * Custom text displayed for the default option.
   *
   * @default `placeholder`
   */
  defaultOptionText?: string;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Whether the field label renders above the native select. The control has no
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
   * Validation error for the field — pass a single message `string`, or a
   * `string[]` when the field can fail multiple rules at once (every message
   * is shown together).
   *
   * A non-empty string or a non-empty array puts the field into an error state
   * and surfaces the message(s) through `FormHelperText`; `undefined`, `''` or
   * `[]` clear it.
   *
   * Use `renderError` to customize how the message(s) are rendered.
   */
  errorMessage?: string | string[];
  /**
   * Custom renderer for the resolved error message(s), called only when the
   * field is in an error state. Always receives a `string[]` — use `errors[0]`
   * for the common single-message case, or map over `errors` when a field fails
   * several rules.
   *
   * When omitted, a single message renders as plain text and multiple
   * messages render on separate lines.
   *
   * @param errors - Resolved error messages for this field (never empty).
   */
  renderError?: (errors: string[]) => ReactNode;
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
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & InputNativeSelectProps;

const MUINativeSelect = <
  Option extends StrNumObjOption = StrNumObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
>({
  fieldName,
  options,
  labelKey,
  valueKey,
  value: muiValue,
  onValueChange,
  renderOptionLabel,
  getOptionDisabled,
  disabled: muiDisabled,
  defaultOptionText,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  sx,
  onBlur,
  autoComplete = defaultAutocompleteValue,
  placeholder,
  customIds,
  ...otherNativeSelectProps
}: MUINativeSelectProps<Option, LabelKey, ValueKey>) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
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
  const defaultOptionLabel = defaultOptionText ?? placeholder ?? '';
  const errorList = getErrorList(errorMessage);
  const isError = errorList.length > 0;
  const fieldErrorMessage = isError
    ? renderError?.(errorList) ?? (
      errorList.length === 1
        ? errorList[0]
        : errorList.map((message, index) => (
          <div key={index}>
            {message}
          </div>
        ))
    )
    : undefined;
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  return (
    <FormControl
      error={isError}
      disabled={muiDisabled}
      fullWidth
    >
      {!hideLabel && isLabelAboveControl && (
        <FormLabel
          label={fieldLabel}
          isVisible
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            htmlFor: fieldId
          }}
        />
      )}
      <NativeSelect
        {...otherNativeSelectProps}
        id={fieldId}
        name={fieldName}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={isError}
        aria-labelledby={
          !hideLabel && isLabelAboveControl ? labelId : undefined
        }
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
        value={muiValue ?? ''}
        disabled={muiDisabled}
        onChange={event => {
          const selectedValue = event.target.value;
          const normalizedValue = normalizeSelectValue(
            selectedValue,
            options,
            labelKey,
            valueKey
          ) as OptionValue<Option, ValueKey>;
          onValueChange({ newValue: normalizedValue, event });
        }}
        onBlur={onBlur}
        sx={{
          ...sx,
          '&.MuiNativeSelect-root': {
            margin: 0
          }
        }}
      >
        <option value="" disabled={required}>
          {defaultOptionLabel}
        </option>
        {options.map((option, index) => {
          const isObject = isKeyValueOption(option, labelKey, valueKey);
          const opnValue = getOptionValue<Option, ValueKey>(
            option,
            valueKey
          );
          const opnLabel = isObject
            ? String(option[labelKey!])
            : String(option);
          const isOptionDisabled = getOptionDisabled?.(option) ?? false;
          const isSelected = muiValue === opnValue;

          return (
            <option
              key={`${opnValue}-${index}`}
              value={opnValue}
              disabled={isOptionDisabled}
            >
              {renderOptionLabel?.(option, {
                disabled: isOptionDisabled || !!muiDisabled,
                selected: isSelected
              }) ?? opnLabel}
            </option>
          );
        })}
      </NativeSelect>
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

export default MUINativeSelect;
