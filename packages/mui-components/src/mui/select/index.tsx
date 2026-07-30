'use client';

import {
  useContext,
  Fragment,
  type ReactNode
} from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect, { type SelectChangeEvent } from '@mui/material/Select';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  MUISELECT_OPTIONS_THRESHOLD,
  type FormLabelProps,
  type FormHelperTextProps,
  type SelectProps,
  type OptionValue,
  type OptionRenderState
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { StrNumObjOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  keepLabelAboveFormField,
  getOptionValue,
  normalizeSelectValue,
  useFieldIds,
  getDisplayLabelForSelectValue,
  generateLargeOptionsErrMsg,
  getErrorList
} from '@/utils';

type SelectValue<Value, Multiple extends boolean> = Multiple extends true
  ? Value[]
  : Value;

type OnValueChangeProps<
  Option extends StrNumObjOption = StrNumObjOption,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false
> = {
  newValue: SelectValue<OptionValue<Option, ValueKey>, Multiple>;
  event: SelectChangeEvent<SelectValue<OptionValue<Option, ValueKey>, Multiple>>;
  child: ReactNode;
};

export type MUISelectProps<
  Option extends StrNumObjOption = StrNumObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * List of options to display in the dropdown.
   * Note:
   * - Works best for small to moderate datasets.
   * - If options exceed ~20 items, `MUIAutocomplete` or `MUIMultiAutocomplete` is
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
   * Current select value, normalized with `valueKey` for object options.
   * For `multiple`, pass an array. `undefined`/`null` are treated as no
   * selection (an empty array when `multiple` is true).
   */
  value?: NoInfer<SelectValue<OptionValue<Option, ValueKey>, Multiple>> | null;
  /**
   * Called after the selected value is normalized using `valueKey` for object options.
   *
   * @param newValue - Normalized selected value, or an array for multiple selection.
   * @param event - Original MUI Select change event.
   * @param child - Selected option element provided by MUI Select.
   */
  onValueChange: ({
    newValue,
    event,
    child
  }: OnValueChangeProps<Option, ValueKey, Multiple>) => void;
  /**
   * Custom renderer for dropdown options.
   *
   * Use this prop to customize the label for each option in the `MenuItem` component.
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
   * Return `true` to disable the option and prevent it from being selected.
   *
   * @param option - The option being evaluated.
   */
  getOptionDisabled?: (option: Option) => boolean;
  /**
   * When true, allows selecting multiple values.
   */
  multiple?: Multiple;
  /**
   * When `true`, displays a default placeholder option at the top of the
   * dropdown menu.
   *
   * The option uses an empty string (`''`) as its value and is automatically
   * disabled when the field is marked as required.
   *
   * @default false
   */
  showDefaultOption?: boolean;
  /**
   * Custom text displayed for the default option when
   * `showDefaultOption` is enabled.
   *
   * @default `Select ${fieldLabel}`
   */
  defaultOptionText?: string;
  /**
   * When true, renders the field label above the form field instead of inside or beside it.
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
   * Placeholder text displayed when no option is selected.
   *
   * Unlike the default option, the placeholder is displayed in the select
   * input itself and is not rendered as a selectable menu item.
   */
  placeholder?: string;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & SelectProps;

const componentName = 'MUISelect';

const MUISelect = <
  Option extends StrNumObjOption = StrNumObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false
>({
  fieldName,
  options,
  labelKey,
  valueKey,
  value: muiValue,
  onValueChange,
  renderOptionLabel,
  getOptionDisabled,
  multiple,
  showDefaultOption,
  defaultOptionText,
  disabled: muiDisabled,
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
  onBlur,
  autoComplete = defaultAutocompleteValue,
  renderValue,
  placeholder,
  customIds,
  inputProps: muiSelectInputProps,
  ...otherSelectProps
}: MUISelectProps<Option, LabelKey, ValueKey, Multiple>) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);

  if (options.length > MUISELECT_OPTIONS_THRESHOLD) {
    console.warn(generateLargeOptionsErrMsg(componentName, options.length));
  }

  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );

  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;

  const SelectFormLabel = (
    <FormLabelText label={fieldLabel} required={required} />
  );
  const resolvedValue = muiValue ?? (multiple ? [] : '');
  const isValueEmpty
    = muiValue === undefined
      || muiValue === null
      || muiValue === ''
      || (multiple && Array.isArray(muiValue) && !muiValue.length);
  const showPlaceholder = isValueEmpty && !!placeholder;
  const selectLabelValue
    = hideLabel || isLabelAboveFormField || showPlaceholder || isValueEmpty
      ? undefined
      : SelectFormLabel;
  const selectLabelId = isLabelAboveFormField || hideLabel
    ? undefined
    : labelId;
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
    <FormControl error={isError} disabled={muiDisabled}>
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveFormField}
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
      {!hideLabel && !isLabelAboveFormField && !showPlaceholder && (
        <InputLabel
          id={labelId}
          htmlFor={fieldId}
          shrink={!isValueEmpty}
          disabled={muiDisabled}
        >
          {SelectFormLabel}
        </InputLabel>
      )}
      <MuiSelect
        {...otherSelectProps}
        inputProps={{
          ...muiSelectInputProps,
          id: fieldId
        }}
        name={fieldName}
        autoComplete={autoComplete}
        labelId={selectLabelId}
        aria-required={required}
        aria-invalid={isError}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        label={selectLabelValue}
        value={resolvedValue}
        error={isError}
        multiple={multiple}
        displayEmpty={isValueEmpty}
        disabled={muiDisabled}
        onChange={(event, child) => {
          const selectEvent = event as SelectChangeEvent<
            SelectValue<OptionValue<Option, ValueKey>, Multiple>
          >;
          const selectedValue = selectEvent.target.value;
          const normalizedValue = normalizeSelectValue(
            selectedValue,
            options,
            labelKey,
            valueKey
          ) as SelectValue<OptionValue<Option, ValueKey>, Multiple>;
          onValueChange({
            newValue: normalizedValue,
            event: selectEvent,
            child
          });
        }}
        onBlur={onBlur}
        renderValue={value => {
          if (showPlaceholder) {
            return (
              <span
                aria-hidden="true"
                style={{ opacity: 0.6, color: 'inherit' }}
              >
                {placeholder}
              </span>
            );
          }
          if (Array.isArray(value)) {
            const labels = value
              .map(val =>
                getDisplayLabelForSelectValue(
                  val,
                  options,
                  labelKey,
                  valueKey
                ))
              .filter(
                (node): node is Exclude<typeof node, ''> =>
                  node !== '' && node !== null && node !== undefined
              );
            return (
              <Fragment>
                {renderValue?.(value) ?? labels.join(', ')}
              </Fragment>
            );
          }
          const optionLabel = getDisplayLabelForSelectValue(
            value,
            options,
            labelKey,
            valueKey
          );
          return (
            <Fragment>
              {renderValue?.(value) ?? optionLabel}
            </Fragment>
          );
        }}
      >
        {showDefaultOption && (
          <MenuItem value="" disabled={required}>
            {defaultOptionText ?? `Select ${defaultFieldLabel}`}
          </MenuItem>
        )}
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
          /**
           * `Array.isArray` can't narrow the generic `SelectValue` union, so
           * normalize to a concrete array (single value or the multi list) and
           * annotate before comparing — the same idiom used in the file uploader.
           */
          const currentValues = (
            Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue]
          ) as OptionValue<Option, ValueKey>[];
          const isSelected = currentValues.includes(opnValue);
          return (
            <MenuItem
              key={`${opnValue}-${index}`}
              value={opnValue}
              disabled={isOptionDisabled}
            >
              {renderOptionLabel?.(option, {
                disabled: isOptionDisabled || !!muiDisabled,
                selected: isSelected
              }) ?? opnLabel}
            </MenuItem>
          );
        })}
      </MuiSelect>
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

export default MUISelect;
