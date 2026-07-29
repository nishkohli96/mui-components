'use client';

import {
  useContext,
  type ReactNode,
  type ChangeEvent
} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import MuiRadioGroup, { type RadioGroupProps } from '@mui/material/RadioGroup';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type FormLabelProps,
  type FormControlLabelProps,
  type FormHelperTextProps,
  type RadioProps,
  type OptionValue,
  type OptionRenderState
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { StrNumObjOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  normalizeSelectValue,
  getOptionValue,
  useFieldIds,
  resolveLabelAboveControl,
  getErrorList
} from '@/utils';

type OnValueChangeProps<
  Option extends StrNumObjOption = StrNumObjOption,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >
> = {
  newValue: OptionValue<Option, ValueKey>;
  event: ChangeEvent<HTMLInputElement>;
};

type RadioGroupInputProps = Omit<
  RadioGroupProps,
  'name' | 'value' | 'onChange'
>;

export type MUIRadioGroupProps<
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
   * Currently selected option value. This is a controlled component: `value` and
   * `onValueChange` must be supplied together, typically backed by your own state
   * or form library.
   *
   * `undefined`/`null` are treated as no selection.
   */
  value?: NoInfer<OptionValue<Option, ValueKey>> | null;
  /**
   * Called on every selection with the normalized option value and the original
   * change event. Call your state setter (or form library's setter) with
   * `newValue` to update `value`.
   *
   * @param newValue - Normalized selected option value, using `valueKey` for object options when provided.
   * @param event - Original radio change event.
   */
  onValueChange: ({
    newValue,
    event
  }: OnValueChangeProps<Option, ValueKey>) => void;
  /**
   * List of options to render as radio buttons. Best suited for smaller datasets, with
   * upto 10 options. For larger datasets, consider using `MUIAutocomplete`.
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
   * Function to customize the label for each radio button.
   * When not provided, the option label derived from `labelKey` (or the
   * option value itself for primitive options) is rendered.
   *
   * @param option - The option being rendered.
   * @param state - Current status of the option (`disabled`, `selected`), so the
   *   label can react to it — e.g. dim a disabled option.
   * @returns Custom React content to display for the option.
   */
  renderOptionLabel?: (option: Option, state: OptionRenderState) => ReactNode;
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
   * Whether the field label renders above the radio group. The group has no
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
   * Props to pass down to each Radio component. Can be used to set
   * a custom color, size, etc. for all radios in the group.
   */
  radioProps?: RadioProps;
  /**
   * Props forwarded to each internal MUI `FormControlLabel`.
   */
  formControlLabelProps?: FormControlLabelProps;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
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
} & RadioGroupInputProps;

const MUIRadioGroup = <
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
  renderOptionLabel,
  getOptionDisabled,
  labelKey,
  valueKey,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  radioProps,
  formControlLabelProps,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  onBlur,
  customIds,
  ...otherRadioGroupProps
}: MUIRadioGroupProps<Option, LabelKey, ValueKey>) => {
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
      component="fieldset"
      error={isError}
      disabled={muiDisabled}
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
      <MuiRadioGroup
        {...otherRadioGroupProps}
        id={fieldId}
        name={fieldName}
        value={value ?? ''}
        onChange={(event, selectedValue) => {
          const normalizedValue = normalizeSelectValue(
            selectedValue,
            options,
            labelKey,
            valueKey
          ) as OptionValue<Option, ValueKey>;
          onValueChange({ newValue: normalizedValue, event });
        }}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-labelledby={!hideLabel ? labelId : undefined}
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
      >
        {options.map(option => {
          const isObject = isKeyValueOption(option, labelKey, valueKey);
          const opnValue = getOptionValue<Option, ValueKey>(
            option,
            valueKey
          );
          const opnLabel = isObject
            ? String(option[labelKey!])
            : String(option);
          const isOptionDisabled
            = getOptionDisabled?.(option) || muiDisabled || false;
          return (
            <FormControlLabel
              {...otherFormControlLabelProps}
              key={opnValue}
              control={
                <Radio
                  {...radioProps}
                  id={`${fieldId}-${opnValue}`}
                  disabled={isOptionDisabled}
                />
              }
              value={opnValue}
              label={
                renderOptionLabel?.(option, {
                  disabled: isOptionDisabled,
                  selected: value === opnValue
                }) ?? opnLabel
              }
              disabled={isOptionDisabled}
              sx={appliedFormControlLabelSx}
            />
          );
        })}
      </MuiRadioGroup>
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

export default MUIRadioGroup;
