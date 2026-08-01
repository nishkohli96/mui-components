'use client';

import {
  useContext,
  useCallback,
  useMemo,
  type ReactNode
} from 'react';
import Box from '@mui/material/Box';
import Autocomplete,
{
  type AutocompleteProps
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  defaultSelectAllOptionLabel,
  selectAllOptionValue,
  type FormLabelProps,
  type FormControlLabelProps,
  type CheckboxProps,
  type FormHelperTextProps,
  type AutoCompleteTextFieldProps,
  type MuiChipProps,
  type AutocompleteOptionRenderState
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { KeyValueOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  useFieldIds,
  keepLabelAboveFormField,
  getErrorList,
  mergeSx
} from '@/utils';

type AutocompleteOption<Option extends KeyValueOption = KeyValueOption>
  = Option | string;

type MultiAutoCompleteProps<
  Option extends KeyValueOption = KeyValueOption,
  DisableClearable extends boolean = false
> = Omit<
  AutocompleteProps<Option, true, DisableClearable, false>,
  | 'freeSolo'
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
  | 'blurOnSelect'
  | 'disableClearable'
  | 'disableCloseOnSelect'
  | 'ChipProps'
  | 'ref'
>;

type OnValueChangeProps<Option extends KeyValueOption = KeyValueOption> = {
  newValue: Option[];
  selectedOption?: Option | typeof selectAllOptionValue;
};

export type MUIMultiAutocompleteObjectProps<
  Option extends KeyValueOption = KeyValueOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  DisableClearable extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Currently selected option objects. This is a controlled component: `value`
   * and `onValueChange` must be supplied together, typically backed by your own
   * state or form library.
   *
   * `undefined`/`null`/`[]` are treated as an empty selection.
   */
  value?: Option[];
  /**
   * Called on every selection change with the next selected object array and the
   * option that triggered the change. Call your state setter (or form library's
   * setter) with `newValue` to update `value`.
   *
   * @param newValue - Next selected option object array.
   * @param selectedOption - Option object that triggered the change, or the select-all sentinel.
   */
  onValueChange: ({ newValue, selectedOption }: OnValueChangeProps<Option>) => void;
  /**
   * Options rendered by the field.
   */
  options: Option[];
  /**
   * Object key used to read the display label from each option.
   */
  labelKey?: LabelKey;
  /**
   * Object key used to compare options with the current value.
   */
  valueKey?: ValueKey;
  /**
   * When true, the selected value cannot be cleared from the input.
   * @default false
   */
  disableClearable?: DisableClearable;
  /**
   * Text to display for the "Select All" option.
   */
  selectAllText?: string;
  /**
   * When true, hides the select-all option.
   */
  hideSelectAllOption?: boolean;
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
   * Props forwarded to each internal MUI `Checkbox`.
   */
  checkboxProps?: CheckboxProps;
  /**
   * Custom renderer for an option label. `state` carries MUI's option state
   * (`selected`, `index`, `inputValue`) plus a `disabled` flag, so the label
   * can react to the option's status — e.g. dim a disabled option.
   */
  renderOptionLabel?: (
    option: Option,
    state: AutocompleteOptionRenderState
  ) => ReactNode;
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
} & MultiAutoCompleteProps<Option, DisableClearable>;

/**
 * The component is designed to work with complete option objects as its value.
 *
 * `freeSolo` is not supported in `MUIMultiAutocompleteObject` as it would
 * introduce string values alongside objects (`Option | string`), making the
 * field value less predictable and type-safe.
 *
 * Use `MUIMultiAutocomplete` instead when `freeSolo` behavior is required.
 */
const MUIMultiAutocompleteObject = <
  Option extends KeyValueOption = KeyValueOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  DisableClearable extends boolean = false
>({
  fieldName,
  value,
  onValueChange,
  options,
  labelKey,
  valueKey,
  disableClearable,
  autoHighlight = true,
  onBlur: muiOnBlur,
  selectAllText = defaultSelectAllOptionLabel,
  hideSelectAllOption,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  checkboxProps,
  renderOptionLabel,
  formControlLabelProps,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  textFieldProps,
  slotProps,
  ChipProps,
  loading,
  customIds,
  getOptionDisabled,
  limitTags = 2,
  getLimitTagsText,
  ...otherMultiAutocompleteObjectProps
}: MUIMultiAutocompleteObjectProps<
  Option,
  LabelKey,
  ValueKey,
  DisableClearable
>) => {
  const {
    allLabelsAboveFields,
    defaultFormControlLabelSx,
  } = useContext(MUIComponentsConfigContext);

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

  /*
   * Options the user can actually toggle. "Select All" operates on these, so
   * disabled options are never bulk-selected, and the control hides when there
   * is nothing (or only one selectable option) to select.
   */
  const selectableOptions = getOptionDisabled
    ? options.filter(option => !getOptionDisabled(option))
    : options;
  const shouldHideSelectAllOptions
    = hideSelectAllOption || selectableOptions.length <= 1;

  const { sx, ...otherFormControlLabelProps } = formControlLabelProps ?? {};
  const appliedFormControlLabelSx = mergeSx(defaultFormControlLabelSx, sx);

  const autoCompleteOptions: AutocompleteOption<Option>[] = useMemo(() => {
    if (shouldHideSelectAllOptions) {
      return options;
    }
    return [selectAllText, ...options];
  }, [options, selectAllText, shouldHideSelectAllOptions]);

  const isSelectAllOption = useCallback(
    (option: AutocompleteOption<Option>): option is string =>
      option === selectAllText,
    [selectAllText]
  );

  const getOptionLabelOrValue = useCallback(
    (option: Option | string, key?: LabelKey | ValueKey) => {
      if (typeof option === 'string') {
        return option;
      }
      const raw = key
        ? (option as Record<string, unknown>)[key]
        : undefined;
      return typeof raw === 'string' || typeof raw === 'number'
        ? String(raw)
        : String(option);
    },
    []
  );

  const displayOptionLabel = useCallback(
    (option: AutocompleteOption<Option>, getSelectAllValue?: boolean) =>
      isSelectAllOption(option)
        ? getSelectAllValue
          ? selectAllOptionValue
          : selectAllText
        : getOptionLabelOrValue(option, labelKey),
    [isSelectAllOption, selectAllText, getOptionLabelOrValue, labelKey]
  );

  const optionsEqual = useCallback(
    (a: Option, b: Option): boolean => {
      if (
        valueKey
        && isKeyValueOption(a, labelKey, valueKey)
        && isKeyValueOption(b, labelKey, valueKey)
      ) {
        return a[valueKey] === b[valueKey];
      }
      return a === b;
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
  const selectedOptions: Option[] = value ?? [];

  const selectionContainsOption = (selected: Option[], opt: Option) =>
    selected.some(sel => optionsEqual(sel, opt));

  /*
   * Disabled options can't be toggled, so their current selection is frozen:
   * "Select All" keeps them and adds every selectable option, "Deselect All"
   * keeps only them.
   *
   * Frozen selections are found by matching against the current `selectableOptions`
   * (via `optionsEqual`) rather than calling `getOptionDisabled` on selected
   * values — those may be stale or differently shaped after an options refresh,
   * and the consumer's predicate can assume an option from the current list.
   */
  const selectedDisabledOptions = getOptionDisabled
    ? selectedOptions.filter(
      sel => !selectableOptions.some(opt => optionsEqual(sel, opt))
    )
    : [];
  const selectAllValue = [...selectedDisabledOptions, ...selectableOptions];
  const someSelectableSelected = selectableOptions.some(opt =>
    selectionContainsOption(selectedOptions, opt));
  const areAllSelected
    = selectableOptions.length > 0
      && selectableOptions.every(opt =>
        selectionContainsOption(selectedOptions, opt));
  /*
   * Tri-state reflects only the selectable options — a frozen disabled selection
   * doesn't count, so "Select All" reads unchecked (not indeterminate) when just
   * disabled options remain selected.
   */
  const isIndeterminate = someSelectableSelected && !areAllSelected;

  const changeFieldState = (
    newValues: Option[],
    selectedOption?: Option | typeof selectAllOptionValue
  ) => {
    onValueChange({
      newValue: newValues,
      selectedOption
    });
  };

  const handleCheckboxChange = (
    currentValue: Option[],
    rowOption: AutocompleteOption<Option>,
    checked: boolean
  ): Option[] => {
    /* When "Select All" checkbox is toggled. */
    if (isSelectAllOption(rowOption)) {
      return checked ? selectAllValue : selectedDisabledOptions;
    }
    /* When one of the options is selected */
    return checked
      ? selectionContainsOption(currentValue, rowOption)
        ? currentValue
        : [...currentValue, rowOption]
      : currentValue.filter(val => !optionsEqual(val, rowOption));
  };

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
        {...otherMultiAutocompleteObjectProps}
        id={fieldId}
        options={autoCompleteOptions as Option[]}
        multiple
        freeSolo={false}
        disableClearable={disableClearable}
        value={selectedOptions}
        onChange={(_, newSelectedOptions, reason, details) => {
          if (reason === 'clear') {
            onValueChange({ newValue: [] });
            return;
          }
          const isSelectAllSelected
            = newSelectedOptions.some(isSelectAllOption);
          if (isSelectAllSelected) {
            const finalValue = areAllSelected
              ? selectedDisabledOptions
              : selectAllValue;
            onValueChange({
              newValue: finalValue,
              selectedOption: selectAllOptionValue
            });
            return;
          }

          const clickedOption = details?.option;
          const finalValue = newSelectedOptions.filter(
            option => !isSelectAllOption(option)
          );
          const selectedOption = clickedOption && !isSelectAllOption(clickedOption)
            ? clickedOption
            : undefined;
          onValueChange({
            newValue: finalValue,
            selectedOption
          });
        }}
        onBlur={muiOnBlur}
        disabled={muiDisabled}
        getOptionLabel={option => displayOptionLabel(option, true)}
        isOptionEqualToValue={(option, value) => {
          if (isSelectAllOption(option)) {
            return false;
          }
          if (valueKey && isKeyValueOption(option, labelKey, valueKey)) {
            return (
              option[valueKey] === (value as KeyValueOption)[valueKey]
            );
          }
          return option === value;
        }}
        renderInput={params => {
          const {
            InputProps,
            inputProps,
            disabled: paramsDisabled,
            ...otherInputParams
          } = params ?? {};
          const {
            autoComplete = defaultAutocompleteValue,
            placeholder,
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
              placeholder={
                selectedOptions.length > 0 ? undefined : placeholder
              }
              {...otherInputParams}
              label={
                !hideLabel && !isLabelAboveFormField
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
                      {InputProps.endAdornment}
                    </>
                  )
                },
                htmlInput: textFieldInputProps
              }}
            />
          );
        }}
        renderOption={({ key, ...optionProps }, option, state) => {
          const optionLabel = displayOptionLabel(option);
          if (isSelectAllOption(option)) {
            return (
              <Box component="li" key={key} {...optionProps}>
                <FormControlLabel
                  {...otherFormControlLabelProps}
                  label={optionLabel}
                  disabled={muiDisabled}
                  control={(
                    <Checkbox
                      {...checkboxProps}
                      id={`${fieldName}_${selectAllOptionValue}`}
                      name={`${fieldName}_${selectAllOptionValue}`}
                      value={selectAllOptionValue}
                      checked={areAllSelected}
                      indeterminate={isIndeterminate}
                      disabled={muiDisabled}
                    />
                  )}
                  sx={{ ...appliedFormControlLabelSx, width: '100%' }}
                  onClick={e => {
                    e.preventDefault();
                    changeFieldState(
                      handleCheckboxChange(
                        selectedOptions,
                        option,
                        !areAllSelected
                      ),
                      selectAllOptionValue
                    );
                  }}
                />
              </Box>
            );
          }
          const optionValue = getOptionLabelOrValue(option, valueKey);
          const isOptionDisabled
            = getOptionDisabled?.(option) || muiDisabled;
          return (
            <Box component="li" key={key} {...optionProps}>
              <FormControlLabel
                {...otherFormControlLabelProps}
                label={
                  renderOptionLabel?.(option, {
                    ...state,
                    disabled: !!isOptionDisabled
                  })
                  ?? optionLabel
                }
                disabled={isOptionDisabled}
                control={
                  <Checkbox
                    {...checkboxProps}
                    id={`${fieldName}_${optionValue}`}
                    name={`${fieldName}_${optionValue}`}
                    value={optionValue}
                    checked={
                      selectionContainsOption(selectedOptions, option)
                    }
                    disabled={isOptionDisabled}
                  />
                }
                sx={{ ...appliedFormControlLabelSx, width: '100%' }}
                onClick={e => {
                  e.preventDefault();
                  if (isOptionDisabled) {
                    return;
                  }
                  const checked = !selectionContainsOption(
                    selectedOptions,
                    option
                  );
                  changeFieldState(
                    handleCheckboxChange(
                      selectedOptions,
                      option,
                      checked
                    ),
                    option
                  );
                }}
              />
            </Box>
          );
        }}
        limitTags={limitTags}
        getLimitTagsText={more => getLimitTagsText?.(more) ?? `+${more} More`}
        autoHighlight={autoHighlight}
        disableCloseOnSelect
        blurOnSelect={false}
        loading={loading}
        fullWidth
        slotProps={{
          ...slotProps,
          chip: ChipProps,
          listbox: {
            ...slotProps?.listbox
          }
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

export default MUIMultiAutocompleteObject;
