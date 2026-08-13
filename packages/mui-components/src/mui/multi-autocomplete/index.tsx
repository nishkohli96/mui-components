'use client';

import {
  useContext,
  useCallback,
  useMemo,
  forwardRef,
  type JSX,
  type Ref,
  type ReactNode
} from 'react';
import Box from '@mui/material/Box';
import Autocomplete,
{
  type AutocompleteProps,
  type AutocompleteValue
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
  type AutocompleteOptionRenderState,
  type MuiChipProps,
  type CircularProgressProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { StrObjOption, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  isKeyValueOption,
  useFieldIds,
  keepLabelAboveFormField,
  getErrorList,
  mergeSx
} from '@/utils';

type MultiAutoCompleteProps<
  Option extends StrObjOption = StrObjOption,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
> = Omit<
  AutocompleteProps<Option, true, DisableClearable, FreeSolo>,
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

type OnValueChangeProps = {
  newValue: string[];
  selectedOption?: string;
};

export type MUIMultiAutocompleteProps<
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Currently selected string values (normalized with `valueKey` for object options).
   * This is a controlled component: `value` and `onValueChange` must be supplied
   * together, typically backed by your own state or form library.
   * `undefined`/`null`/`[]` are treated as an empty selection.
   */
  value?: string[];
  /**
   * Called on every selection change with the next string array and the option
   * value that triggered the change. Call your state setter (or form library's
   * setter) with `newValue` to update `value`.
   *
   * @param newValue - Next selected string value array.
   * @param selectedOption - Option value that triggered the change, or the select-all sentinel.
   */
  onValueChange: ({ newValue, selectedOption }: OnValueChangeProps) => void;
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
   * When true, the selected value cannot be cleared from the input.
   * @default false
   */
  disableClearable?: DisableClearable;
  /**
   * When true, the user may type any value not present in `options`.
   *
   * The typed string is passed to `onValueChange` as-is.
   *
   * To keep things predictable and type-safe, `freeSolo` is not compatible with
   * `selectAllText` and will hide the "Select All" option.
   */
  freeSolo?: FreeSolo;
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
   * Custom renderer for an option label. `state` carries MUI's option state
   * (`selected`, `index`, `inputValue`) plus a `disabled` flag, so the label
   * can react to the option's status — e.g. dim a disabled option.
   */
  renderOptionLabel?: (
    option: Option,
    state: AutocompleteOptionRenderState
  ) => ReactNode;
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
   * Props forwarded to the internal MUI `CircularProgress` shown in the input
   * while `loading` is true.
   */
  circularProgressProps?: CircularProgressProps;
  /**
   * Props forwarded to chips rendered for selected values.
   */
  ChipProps?: MuiChipProps;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & MultiAutoCompleteProps<Option, DisableClearable, FreeSolo>;

const MUIMultiAutocompleteInner = forwardRef(function MUIMultiAutocomplete<
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
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
    disableClearable,
    freeSolo,
    autoHighlight = true,
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
    circularProgressProps,
    ChipProps,
    onBlur,
    loading,
    customIds,
    getOptionDisabled,
    limitTags = 2,
    getLimitTagsText,
    autoSelect,
    ...otherMultiAutoCompleteProps
  }: MUIMultiAutocompleteProps<
    Option,
    LabelKey,
    ValueKey,
    DisableClearable,
    FreeSolo
  >,
  ref: Ref<HTMLInputElement>
) {
  const {
    allLabelsAboveFields,
    defaultFormControlLabelSx
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
    = freeSolo || hideSelectAllOption || selectableOptions.length <= 1;

  const { sx, ...otherFormControlLabelProps } = formControlLabelProps ?? {};
  const appliedFormControlLabelSx = mergeSx(defaultFormControlLabelSx, sx);

  const autoCompleteOptions: Option[] = useMemo(() => {
    if (shouldHideSelectAllOptions) {
      return options;
    }
    return [selectAllText as Option, ...options];
  }, [options, selectAllText, shouldHideSelectAllOptions]);

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

  const isSelectAllOption = useCallback(
    (option: Option | string) => option === selectAllText,
    [selectAllText]
  );

  const getOptionLabelOrValue = useCallback(
    (option: Option | string, key?: LabelKey | ValueKey) => {
      if (typeof option === 'string') {
        return option;
      }
      /*
       * Read the requested key directly rather than gating on the full
       * `isKeyValueOption` (which requires *both* labelKey and valueKey). Reading
       * only the key being normalized keeps the value correct when the other key
       * is absent, instead of collapsing to `String(option)` (`[object Object]`).
       */
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
    (option: Option | string, getSelectAllValue?: boolean) =>
      isSelectAllOption(option)
        ? getSelectAllValue
          ? selectAllOptionValue
          : selectAllText
        : getOptionLabelOrValue(option, labelKey),
    [isSelectAllOption, selectAllText, getOptionLabelOrValue, labelKey]
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
  const selectedValues: string[] = value ?? [];
  const selectedSet = new Set(selectedValues);

  const selectedOptions = selectedValues.map(val => {
    if (optionsMap) {
      return optionsMap.get(val as Option[ValueKey]) ?? val;
    }
    return options.find(opn => opn === val) ?? val;
  }) as AutocompleteValue<Option, true, DisableClearable, FreeSolo>;

  const selectableValues = selectableOptions.map(option =>
    getOptionLabelOrValue(option, valueKey));
  const selectableValueSet = new Set(selectableValues);
  /*
   * Disabled options can't be toggled, so their current selection is frozen:
   * "Select All" keeps them and adds every selectable value, "Deselect All"
   * keeps only them.
   */
  const selectedDisabledValues = selectedValues.filter(
    val => !selectableValueSet.has(val)
  );
  const selectAllValues = [
    ...new Set([...selectedDisabledValues, ...selectableValues])
  ];
  const someSelectableSelected = selectableValues.some(val =>
    selectedSet.has(val));
  const areAllSelected
    = selectableOptions.length > 0
      && selectableValues.every(val => selectedSet.has(val));
  /*
   * Tri-state reflects only the selectable options — a frozen disabled selection
   * doesn't count, so "Select All" reads unchecked (not indeterminate) when just
   * disabled options remain selected.
   */
  const isIndeterminate = someSelectableSelected && !areAllSelected;

  const changeFieldState = (
    newValues: string[],
    selectedValue?: string
  ) => {
    onValueChange({
      newValue: newValues,
      selectedOption: selectedValue
    });
  };

  const handleCheckboxChange = (
    currentValue: string[],
    optionValue: string,
    checked: boolean
  ): string[] => {
    /* When "Select All" checkbox is toggled. */
    if (!optionValue || optionValue === selectAllOptionValue) {
      return checked ? selectAllValues : selectedDisabledValues;
    }
    /* When one of the options is selected */
    return checked
      ? [...currentValue, optionValue]
      : currentValue.filter(val => val !== optionValue);
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
        {...otherMultiAutoCompleteProps}
        id={fieldId}
        options={autoCompleteOptions}
        multiple
        freeSolo={freeSolo}
        disableClearable={disableClearable}
        autoSelect={freeSolo ? autoSelect ?? true : autoSelect}
        value={selectedOptions}
        onChange={(_, newSelectedOptions, reason, details) => {
          if (reason === 'clear') {
            onValueChange({
              newValue: [],
              selectedOption: undefined
            });
            return;
          }
          const isSelectAllSelected
            = newSelectedOptions.some(isSelectAllOption);
          if (isSelectAllSelected) {
            const finalValue = areAllSelected
              ? selectedDisabledValues
              : selectAllValues;
            onValueChange({
              newValue: finalValue,
              selectedOption: selectAllOptionValue
            });
            return;
          }

          const clickedOption = details?.option;
          const finalValue = newSelectedOptions
            .filter(option => !isSelectAllOption(option))
            .map(option => getOptionLabelOrValue(option, valueKey));
          onValueChange({
            newValue: finalValue,
            selectedOption: clickedOption
              ? getOptionLabelOrValue(clickedOption, valueKey)
              : undefined
          });
        }}
        disabled={muiDisabled}
        onBlur={onBlur}
        getOptionLabel={option => displayOptionLabel(option, true)}
        isOptionEqualToValue={(option, value) => {
          /*
           * Select All is never stored in `value`; matching it to real values when
           * `areAllSelected` made MUI remove the first option on the next click.
           */
          if (isSelectAllOption(option)) {
            return false;
          }
          if (valueKey && isKeyValueOption(option, labelKey, valueKey)) {
            return (
              option[valueKey] === (typeof value === 'object' && value !== null
                ? value[valueKey]
                : value)
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
              {...otherTextFieldProps}
              {...otherInputParams}
              name={fieldName}
              inputRef={ref}
              disabled={paramsDisabled}
              placeholder={
                selectedOptions.length > 0 ? undefined : placeholder
              }
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
                        <CircularProgress
                          color="inherit"
                          size={20}
                          {...circularProgressProps}
                        />
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
          const isSelectAll = isSelectAllOption(option);
          const optionLabel = displayOptionLabel(option);
          if (isSelectAll) {
            return (
              <Box component="li" key={key} {...optionProps}>
                <FormControlLabel
                  {...otherFormControlLabelProps}
                  label={optionLabel}
                  disabled={muiDisabled}
                  control={
                    <Checkbox
                      {...checkboxProps}
                      id={`${fieldName}_${selectAllOptionValue}`}
                      name={`${fieldName}_${selectAllOptionValue}`}
                      value={selectAllOptionValue}
                      checked={areAllSelected}
                      indeterminate={isIndeterminate}
                      disabled={muiDisabled}
                    />
                  }
                  sx={{ ...appliedFormControlLabelSx, width: '100%' }}
                  onClick={e => {
                    e.preventDefault();
                    changeFieldState(
                      handleCheckboxChange(
                        selectedValues,
                        selectAllOptionValue,
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
          const isOptionDisabled = muiDisabled || getOptionDisabled?.(option);
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
                      selectedValues.includes(optionValue)
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
                  const checked = !selectedValues.includes(optionValue);
                  changeFieldState(
                    handleCheckboxChange(
                      selectedValues,
                      optionValue,
                      checked
                    ),
                    optionValue
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
});

/**
 * Always-multiple `Autocomplete` with a "**Select All**" option prepended to
 * the option list, backed by an array of selected value keys.
 *
 * Toggling "**Select All**" option selects/clears every option in one action, and
 * stays in sync (checked/indeterminate) as individual options change.
 *
 * Docs: [MUIMultiAutocomplete](https://mui-components-docs.vercel.app/v1/components/mui/multi-autocomplete)
 *
 * API: [MUIMultiAutocompleteProps](https://mui-components-docs.vercel.app/v1/components/mui/multi-autocomplete#api)
 */
const MUIMultiAutocomplete = MUIMultiAutocompleteInner as <
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  ValueKey extends Extract<keyof Option, string> = Extract<
    keyof Option,
    string
  >,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>(
  props: MUIMultiAutocompleteProps<
    Option,
    LabelKey,
    ValueKey,
    DisableClearable,
    FreeSolo
  > & {
    ref?: Ref<HTMLInputElement>;
  }
) => JSX.Element;

export default MUIMultiAutocomplete;
