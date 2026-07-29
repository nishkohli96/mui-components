'use client';

import {
  useCallback,
  useContext,
  type ReactNode,
  type SyntheticEvent
} from 'react';
import Autocomplete,
{
  type AutocompleteProps,
  type AutocompleteChangeDetails,
  type AutocompleteChangeReason,
  type AutocompleteValue
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  type FormLabelProps,
  type FormHelperTextProps,
  type AutoCompleteTextFieldProps,
  type MuiChipProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { KeyValueOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  useFieldIds,
  keepLabelAboveFormField,
  getErrorList
} from '@/utils';

type OmittedAutocompleteProps<
  Option extends KeyValueOption = KeyValueOption,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
> = Omit<
  AutocompleteProps<Option, Multiple, DisableClearable, false>,
  | 'freeSolo'
  | 'multiple'
  | 'fullWidth'
  | 'renderInput'
  | 'options'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'getOptionLabel'
  | 'isOptionEqualToValue'
  | 'blurOnSelect'
  | 'disableCloseOnSelect'
  | 'ChipProps'
  | 'disableClearable'
>;

type OnValueChangeProps<
  Option extends KeyValueOption = KeyValueOption,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
> = {
  newValue: AutocompleteValue<Option, Multiple, DisableClearable, false>;
  event: SyntheticEvent<Element, Event>;
  reason: AutocompleteChangeReason;
  details?: AutocompleteChangeDetails<Option>;
};

export type MUIAutocompleteObjectProps<
  Option extends KeyValueOption = KeyValueOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Currently selected option object(s): `Option[]` when `multiple` is true,
   * otherwise a single `Option`. This is a controlled component: `value` and
   * `onValueChange` must be supplied together, typically backed by your own state
   * or form library.
   *
   * `undefined`/`null`/`[]` are treated as no selection.
   */
  value?: AutocompleteValue<Option, Multiple, DisableClearable, false>;
  /**
   * Called on every selection change with the selected object value(s) from MUI,
   * without reducing them to `valueKey`. Call your state setter (or form library's
   * setter) with `newValue` to update `value`.
   *
   * @param newValue - Selected value(s): `Option[]` when `multiple` is true, otherwise `Option`.
   * Includes `null` only when clearing is allowed (`disableClearable` is false).
   * @param event - Original MUI Autocomplete change event.
   * @param reason - MUI Autocomplete reason for the change.
   * @param details - Additional MUI Autocomplete change details, when available.
   */
  onValueChange: ({
    newValue,
    event,
    reason,
    details
  }: OnValueChangeProps<Option, Multiple, DisableClearable>) => void;
  /**
   * Options rendered by the field.
   */
  options: Option[];
  /**
   * When true, allows selecting multiple values.
   */
  multiple?: Multiple;
  /**
   * Object key used to read the display label from each option.
   */
  labelKey: LabelKey;
  /**
   * Object key used to compare options with the current value.
   */
  valueKey: ValueKey;
  /**
   * When true, the selected value cannot be cleared from the input.
   * @default false
   */
  disableClearable?: DisableClearable;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
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
   * Helper text shown below the field when there is no visible validation error.
   */
  helperText?: ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * Props forwarded to the internal MUI `TextField`.
   */
  textFieldProps?: AutoCompleteTextFieldProps;
  /**
   * Props forwarded to chips rendered for selected values.
   */
  ChipProps?: MuiChipProps;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & OmittedAutocompleteProps<Option, Multiple, DisableClearable>;

/**
 * The component is designed to work with complete option object(s) as its value.
 *
 * `freeSolo` is not supported in `MUIAutocompleteObject` as it would introduce
 * string values alongside objects (`Option | string`), making the field value
 * less predictable and type-safe.
 *
 * Use `MUIAutocomplete` instead when `freeSolo` behavior is required.
 */
const MUIAutocompleteObject = <
  Option extends KeyValueOption = KeyValueOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
>({
  fieldName,
  value,
  onValueChange,
  options,
  multiple,
  labelKey,
  valueKey,
  disableClearable,
  autoHighlight = true,
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
  textFieldProps,
  slotProps,
  ChipProps,
  onBlur,
  onFocus,
  loading,
  limitTags = 2,
  getLimitTagsText,
  customIds,
  ...otherAutocompleteObjectProps
}: MUIAutocompleteObjectProps<
  Option,
  LabelKey,
  ValueKey,
  Multiple,
  DisableClearable
>) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);

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

  const renderOptionLabel = useCallback(
    (option: Option): string => String(option[labelKey]),
    [labelKey]
  );

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
      <Autocomplete
        {...otherAutocompleteObjectProps}
        id={fieldId}
        options={options}
        multiple={multiple}
        value={
          (value ?? (multiple ? [] : null)) as AutocompleteValue<
            Option,
            Multiple,
            DisableClearable,
            false
          >
        }
        disabled={muiDisabled}
        onChange={(
          event,
          newValue,
          reason: AutocompleteChangeReason,
          details?: AutocompleteChangeDetails<Option>
        ) => {
          onValueChange({
            newValue,
            event,
            reason,
            details
          });
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        getOptionLabel={option => renderOptionLabel(option)}
        isOptionEqualToValue={(option, value) =>
          option[valueKey] === value?.[valueKey]}
        renderInput={params => {
          const {
            InputProps,
            inputProps,
            disabled: paramsDisabled,
            ...otherInputParams
          } = params ?? {};
          const {
            autoComplete = defaultAutocompleteValue,
            ...otherTextFieldProps
          } = textFieldProps ?? {};
          const textFieldInputProps = {
            ...inputProps,
            'aria-required': required,
            'aria-invalid': isError,
            'aria-labelledby': !hideLabel && isLabelAboveFormField
              ? labelId
              : undefined,
            'aria-label': hideLabel ? accessibleFieldLabel : undefined,
            'aria-describedby': showHelperTextElement
              ? isError
                ? errorId
                : helperTextId
              : undefined,
            autoComplete
          };
          return (
            <TextField
              name={fieldName}
              disabled={paramsDisabled}
              {...otherTextFieldProps}
              {...otherInputParams}
              label={
                !isLabelAboveFormField
                  ? (
                    <FormLabelText label={fieldLabel} required={required} />
                  )
                  : undefined
              }
              error={isError}
              slotProps={{
                ...textFieldProps?.slotProps,
                input: {
                  ...InputProps,
                  ...textFieldProps?.slotProps?.input,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {InputProps?.endAdornment}
                    </>
                  )
                },
                htmlInput: textFieldInputProps
              }}
            />
          );
        }}
        autoHighlight={autoHighlight}
        blurOnSelect={!multiple}
        disableCloseOnSelect={multiple}
        disableClearable={disableClearable}
        fullWidth
        loading={loading}
        limitTags={limitTags}
        freeSolo={false}
        getLimitTagsText={more => getLimitTagsText?.(more) ?? `+${more} More`}
        slotProps={{
          ...slotProps,
          chip: ChipProps
        }}
      />
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

export default MUIAutocompleteObject;
