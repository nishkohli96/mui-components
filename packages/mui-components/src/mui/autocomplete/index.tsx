'use client';

import {
  useCallback,
  useContext,
  useMemo,
  forwardRef,
  type JSX,
  type Ref,
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
  type MuiChipProps,
  type CircularProgressProps,
  type AutocompleteNewValue
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { StrObjOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  useFieldIds,
  keepLabelAboveFormField,
  getErrorList
} from '@/utils';

type OmittedAutocompleteProps<
  Option extends StrObjOption = StrObjOption,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
> = Omit<
  AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>,
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
  | 'disableClearable'
  | 'disableCloseOnSelect'
  | 'ChipProps'
  | 'ref'
>;

type AutocompleteFieldValue<
  Option,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean
> = AutocompleteValue<Option, Multiple, DisableClearable, FreeSolo>;

type OnValueChangeProps<
  Option,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean
> = {
  newValue: AutocompleteNewValue<Multiple, DisableClearable>;
  selectedOption: AutocompleteValue<
    Option,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  event: SyntheticEvent<Element, Event>;
  reason: AutocompleteChangeReason;
  details?: AutocompleteChangeDetails<Option>;
};

export type MUIAutocompleteProps<
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Currently selected value(s): `string[]` when `multiple` is true, otherwise a
   * `string` (values are normalized with `valueKey` for object options). This is a
   * controlled component: `value` and `onValueChange` must be supplied together,
   * typically backed by your own state or form library.
   *
   * `undefined`/`null`/`[]` are treated as no selection.
   */
  value?: AutocompleteNewValue<Multiple, DisableClearable>;
  /**
   * Called on every selection change with the normalized value and the raw MUI
   * selection. Call your state setter (or form library's setter) with `newValue`
   * to update `value`.
   *
   * @param newValue - Selected value(s): `string[]` when `multiple` is true,
   * otherwise `string`. Includes `null` only when clearing is allowed (`disableClearable` is false).
   * @param selectedOption - Raw MUI selected option/value, including free-solo strings when enabled.
   * @param event - Original MUI Autocomplete change event.
   * @param reason - MUI Autocomplete reason for the change.
   * @param details - Additional MUI Autocomplete change details, when available.
   */
  onValueChange: ({
    newValue,
    selectedOption,
    event,
    reason,
    details
  }: OnValueChangeProps<Option, Multiple, DisableClearable, FreeSolo>) => void;
  /**
   * Options rendered by the field.
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
   * When true, allows selecting multiple values.
   */
  multiple?: Multiple;
  /**
   * When true, the selected value cannot be cleared from the input.
   * @default false
   */
  disableClearable?: DisableClearable;
  /**
   * When true, the user may type any value not present in `options`.
   *
   * The typed string is passed to `onValueChange` as-is. `selectedOption` in
   * the callback reflects `Option | string` for single selection, or
   * `(Option | string)[]` when `multiple` is true.
   */
  freeSolo?: FreeSolo;
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
   * Props forwarded to the internal MUI `TextField`.
   */
  textFieldProps?: AutoCompleteTextFieldProps;
  /**
   * Props forwarded to chips rendered for selected values.
   */
  ChipProps?: MuiChipProps;
  /**
   * Props forwarded to the internal MUI `CircularProgress` shown in the input
   * while `loading` is true.
   */
  circularProgressProps?: CircularProgressProps;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & OmittedAutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>;

const MUIAutocompleteInner = forwardRef(function MUIAutocomplete<
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>(
  {
    fieldName,
    value,
    onValueChange,
    options,
    labelKey,
    valueKey,
    multiple,
    disableClearable,
    freeSolo,
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
    circularProgressProps,
    onFocus,
    onBlur,
    loading,
    limitTags = 2,
    customIds,
    autoSelect,
    getLimitTagsText,
    ...otherAutoCompleteProps
  }: MUIAutocompleteProps<
    Option,
    LabelKey,
    ValueKey,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  ref: Ref<HTMLInputElement>
) {
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

  const optionsMap = useMemo(() => {
    if (!valueKey) {
      return null;
    }

    const map = new Map<Option[ValueKey], Option>();
    for (const option of options) {
      if (isKeyValueOption(option, labelKey, valueKey)) {
        map.set(option[valueKey], option);
      }
    }
    return map;
  }, [options, valueKey, labelKey]);

  const renderOptionLabel = useCallback(
    (option: Option | string): string => {
      if (typeof option === 'string') {
        return option;
      }
      if (labelKey && isKeyValueOption(option, labelKey, valueKey)) {
        return String(option[labelKey]);
      }
      return String(option);
    },
    [labelKey, valueKey]
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

  let selectedOptions: AutocompleteFieldValue<
    Option,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  if (multiple) {
    const multiValue: (Option | string)[] = [];

    for (const val of Array.isArray(value) ? value : []) {
      const option = optionsMap
        ? optionsMap.get(val as Option[ValueKey])
        : options.find(opn => opn === val);
      if (option) {
        multiValue.push(option);
      } else if (freeSolo) {
        multiValue.push(String(val));
      }
    }

    selectedOptions = multiValue as AutocompleteFieldValue<
      Option,
      Multiple,
      DisableClearable,
      FreeSolo
    >;
  } else {
    const singleOption
      = value === null || value === undefined
        ? null
        : optionsMap
          ? optionsMap.get(value as Option[ValueKey])
          ?? (freeSolo ? (value) : null)
          : options.find(opn => (opn as unknown) === value)
            ?? (freeSolo ? (value) : null);

    selectedOptions = singleOption as AutocompleteFieldValue<
      Option,
      Multiple,
      DisableClearable,
      FreeSolo
    >;
  }

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
      {/*
       * Selections render as chips via `renderValue`, which covers both
       * single- and multi-select.
       */}
      <Autocomplete
        {...otherAutoCompleteProps}
        id={fieldId}
        options={options}
        multiple={multiple}
        disableClearable={disableClearable}
        freeSolo={freeSolo}
        autoSelect={freeSolo ? autoSelect ?? true : autoSelect}
        value={selectedOptions}
        onChange={(
          event,
          newValue,
          reason: AutocompleteChangeReason,
          details?: AutocompleteChangeDetails<Option>
        ) => {
          const fieldValue
            = newValue === null
              ? null
              : Array.isArray(newValue)
                ? newValue.map(item =>
                  typeof item !== 'string'
                  && valueKey
                  && isKeyValueOption(item, labelKey, valueKey)
                    ? item[valueKey]
                    : (item as string))
                : typeof newValue !== 'string'
                  && valueKey
                  && isKeyValueOption(newValue, labelKey, valueKey)
                  ? newValue[valueKey]
                  : (newValue as string);

          const storedValue = fieldValue as AutocompleteNewValue<
            Multiple,
            DisableClearable
          >;

          onValueChange({
            newValue: storedValue,
            selectedOption: newValue,
            event,
            reason,
            details
          });
        }}
        disabled={muiDisabled}
        onFocus={onFocus}
        onBlur={onBlur}
        getOptionLabel={renderOptionLabel}
        isOptionEqualToValue={(option, value) => {
          if (!value) {
            return false;
          }
          if (typeof option === 'string') {
            return option === (
              typeof value === 'string' ? value : String(value)
            );
          }
          if (valueKey && isKeyValueOption(option, labelKey, valueKey)) {
            return (
              option[valueKey] === (typeof value === 'object' && value !== null
                ? (value as Option)[valueKey]
                : value)
            );
          }
          return option === value;
        }}
        renderInput={params => {
          const {
            slotProps: paramsSlotProps,
            disabled: paramsDisabled,
            ...otherInputParams
          } = params ?? {};
          const {
            autoComplete = defaultAutocompleteValue,
            ...otherTextFieldProps
          } = textFieldProps ?? {};
          const textFieldInputProps = {
            ...paramsSlotProps.htmlInput,
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
              inputRef={ref}
              disabled={paramsDisabled}
              {...otherTextFieldProps}
              {...otherInputParams}
              label={
                !hideLabel && !isLabelAboveFormField
                  ? (
                    <FormLabelText
                      label={fieldLabel}
                      required={required}
                    />
                  )
                  : undefined
              }
              error={isError}
              slotProps={{
                ...textFieldProps?.slotProps,
                inputLabel: {
                  ...paramsSlotProps.inputLabel,
                  ...textFieldProps?.slotProps?.inputLabel
                },
                input: {
                  ...paramsSlotProps.input,
                  ...textFieldProps?.slotProps?.input,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress
                          color="inherit"
                          size={20}
                          {...circularProgressProps}
                        />
                      )}
                      {paramsSlotProps.input?.endAdornment}
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
        fullWidth
        loading={loading}
        limitTags={limitTags}
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
});

const MUIAutocomplete = MUIAutocompleteInner as <
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>(
  props: MUIAutocompleteProps<
    Option,
    LabelKey,
    ValueKey,
    Multiple,
    DisableClearable,
    FreeSolo
  > & {
    ref?: Ref<HTMLInputElement>;
  }
) => JSX.Element;

export default MUIAutocomplete;
