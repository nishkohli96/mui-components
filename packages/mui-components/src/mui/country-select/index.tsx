'use client';

import {
  useContext,
  useMemo,
  forwardRef,
  type JSX,
  type Ref,
  type ReactNode,
  type SyntheticEvent
} from 'react';
import Box from '@mui/material/Box';
import Autocomplete,
{
  type AutocompleteProps,
  type AutocompleteChangeDetails,
  type AutocompleteChangeReason,
  type AutocompleteValue
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
  type AutocompleteOptionRenderState
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CountryDetails, CountryISO, CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  useFieldIds,
  getErrorList
} from '@/utils';
import CountryMenuItem from './CountryMenuItem';
import { countryList } from './countries';

export type CountrySelectValueKey = keyof Omit<CountryDetails, 'emoji'>;

type CountrySelectStoredPrimitive = CountryDetails[CountrySelectValueKey];

/**
 * The stored value of a single selection: the property named by `valueKey`
 * when one is provided, otherwise the complete `CountryDetails` object.
 */
type CountrySelectStoredItem<
  ValueKey extends CountrySelectValueKey | undefined
> = ValueKey extends CountrySelectValueKey
  ? CountryDetails[ValueKey]
  : CountryDetails;

type CountrySelectStoredValue<
  Multiple extends boolean,
  DisableClearable extends boolean,
  ValueKey extends CountrySelectValueKey | undefined
> = [Multiple] extends [true]
  ? CountrySelectStoredItem<ValueKey>[]
  : [DisableClearable] extends [true]
    ? CountrySelectStoredItem<ValueKey>
    : CountrySelectStoredItem<ValueKey> | null;

type OnValueChangeProps<
  Multiple extends boolean,
  DisableClearable extends boolean,
  ValueKey extends CountrySelectValueKey | undefined
> = {
  newValue: CountrySelectStoredValue<Multiple, DisableClearable, ValueKey>;
  event: SyntheticEvent;
  reason: AutocompleteChangeReason;
  details?: AutocompleteChangeDetails<CountryDetails>;
};

type CountrySelectFieldValue<
  Multiple extends boolean,
  DisableClearable extends boolean
> = AutocompleteValue<CountryDetails, Multiple, DisableClearable, false>;

type AutoCompleteProps<
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
> = Omit<
  AutocompleteProps<CountryDetails, Multiple, DisableClearable, false>,
  | 'freeSolo'
  | 'multiple'
  | 'fullWidth'
  | 'renderInput'
  | 'renderOption'
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
  | 'loading'
  | 'ref'
>;

export type MUICountrySelectProps<
  ValueKey extends CountrySelectValueKey | undefined = undefined,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * List of countries to display in the country selector.
   *
   * Defaults to all countries from `countryList`.
   */
  countries?: CountryDetails[];
  /**
   * List of country ISO codes to pin at the top of the dropdown.
   *
   * Countries are displayed in the same order as provided in this array,
   * followed by the remaining countries sorted in their default order.
   *
   * @example
   * preferredCountries={['US', 'CA', 'IN']}
   */
  preferredCountries?: CountryISO[];
  /**
   * - When `valueKey` is provided, selected value(s) are exposed using the
   *   specified country property.
   * - When `valueKey` is omitted, selected value(s) are exposed as complete
   *   country objects.
   */
  valueKey?: ValueKey;
  /**
   * When true, allows selecting multiple countries.
   */
  multiple?: Multiple;
  /**
   * When true, the selected value cannot be cleared from the input.
   * @default false
   */
  disableClearable?: DisableClearable;
  /**
   * Currently selected country value(s): the property named by `valueKey` when
   * it is provided, otherwise the complete `CountryDetails` object(s). An array
   * when `multiple` is true; `null` is allowed for a single selection unless
   * `disableClearable` is set.
   *
   * This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`null`/`[]` are treated as no selection.
   */
  value?: CountrySelectStoredValue<Multiple, DisableClearable, ValueKey>;
  /**
   * Called on every selection change with the normalized country value and the
   * raw MUI Autocomplete change metadata. Call your state setter (or form
   * library's setter) with `newValue` to update `value`.
   *
   * `newValue` mirrors `value`: the `valueKey` property (e.g. a `string`) when
   * `valueKey` is set, otherwise the full `CountryDetails` object — arrayed when
   * `multiple` is true, and `null` for a cleared single selection unless
   * `disableClearable` is set.
   *
   * @param newValue - Normalized country value, or country value array when `multiple` is true.
   * @param event - Original MUI Autocomplete change event.
   * @param reason - MUI Autocomplete reason for the change.
   * @param details - Additional MUI Autocomplete change details, when available.
   */
  onValueChange: ({
    newValue,
    event,
    reason,
    details
  }: OnValueChangeProps<Multiple, DisableClearable, ValueKey>) => void;
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
   * Customize how each country option is displayed in the dropdown menu.
   * `state` carries MUI's option state (`selected`, `index`, `inputValue`) plus
   * a `disabled` flag, so the label can react to the option's status.
   */
  renderOptionLabel?: (
    option: CountryDetails,
    state: AutocompleteOptionRenderState
  ) => ReactNode;
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
} & AutoCompleteProps<Multiple, DisableClearable>;

const MUICountrySelectInner = forwardRef(function MUICountrySelect<
  ValueKey extends CountrySelectValueKey | undefined = undefined,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
>(
  {
    fieldName,
    countries,
    preferredCountries,
    valueKey,
    multiple,
    disableClearable,
    value,
    onValueChange,
    onBlur: muiOnBlur,
    disabled: muiDisabled,
    autoHighlight = true,
    label,
    showLabelAboveFormField,
    formLabelProps,
    hideLabel,
    renderOptionLabel,
    required,
    errorMessage,
    renderError,
    hideErrorMessage,
    helperText,
    formHelperTextProps,
    textFieldProps,
    slotProps,
    ChipProps,
    customIds,
    limitTags = 2,
    getLimitTagsText,
    getOptionKey,
    ...otherCountrySelectProps
  }: MUICountrySelectProps<ValueKey, Multiple, DisableClearable>,
  ref: Ref<HTMLInputElement>
) {
  const {
    fieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;

  const countryOptions = countries ?? countryList;
  const countrySelectOptions = useMemo(() => {
    let countriesToList = countryOptions;
    let countriesToListAtTop: CountryDetails[] = [];

    if (preferredCountries?.length) {
      countriesToListAtTop = countryOptions.filter(country =>
        preferredCountries.includes(country.iso));

      countriesToListAtTop.sort(
        (a, b) =>
          preferredCountries.indexOf(a.iso)
          - preferredCountries.indexOf(b.iso)
      );

      countriesToList = countryOptions.filter(
        country => !preferredCountries.includes(country.iso)
      );
    }

    return [...countriesToListAtTop, ...countriesToList];
  }, [countryOptions, preferredCountries]);

  const countryMap = useMemo(() => {
    if (!valueKey) {
      return null;
    }
    const map = new Map<CountrySelectStoredPrimitive, CountryDetails>();
    countrySelectOptions.forEach(country => {
      map.set(country[valueKey], country);
    });
    return map;
  }, [countrySelectOptions, valueKey]);

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

  const fieldValue = value as CountrySelectStoredValue<
    Multiple,
    DisableClearable,
    ValueKey
  >;
  const selectedCountries = multiple
    ? Array.isArray(fieldValue)
      ? valueKey && countryMap
        ? fieldValue
          .map(val => countryMap.get(val as CountrySelectStoredPrimitive))
          .filter((country): country is CountryDetails => !!country)
        : fieldValue
      : []
    : valueKey && countryMap
      ? countryMap.get(fieldValue as CountrySelectStoredPrimitive) ?? null
      : fieldValue ?? null;

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
        {...otherCountrySelectProps}
        id={fieldId}
        options={countrySelectOptions}
        multiple={multiple}
        disableClearable={disableClearable}
        freeSolo={false}
        value={
          selectedCountries as CountrySelectFieldValue<
            Multiple,
            DisableClearable
          >
        }
        onChange={(event, newValue, reason, details) => {
          const storedValue = (
            multiple
              ? Array.isArray(newValue)
                ? valueKey
                  ? newValue.map(item => item[valueKey])
                  : newValue
                : []
              : !Array.isArray(newValue) && newValue !== null
                ? valueKey
                  ? newValue[valueKey]
                  : newValue
                : null
          ) as CountrySelectStoredValue<Multiple, DisableClearable, ValueKey>;
          onValueChange({
            newValue: storedValue,
            event,
            reason,
            details
          });
        }}
        onBlur={muiOnBlur}
        disabled={muiDisabled}
        autoHighlight={autoHighlight}
        blurOnSelect={!multiple}
        disableCloseOnSelect={multiple}
        fullWidth
        limitTags={limitTags}
        getLimitTagsText={more => getLimitTagsText?.(more) ?? ( more === 1 ? '+1 Country' : `+${more} Countries`)}
        getOptionKey={getOptionKey ?? (option => String(
          valueKey ? option[valueKey] : option.iso
        ))}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) =>
          valueKey
            ? option[valueKey] === value[valueKey]
            : option.iso === value.iso}
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
              inputRef={ref}
              disabled={paramsDisabled}
              {...otherTextFieldProps}
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
                  ...textFieldProps?.slotProps?.input
                },
                htmlInput: textFieldInputProps
              }}
            />
          );
        }}
        renderOption={({ key, ...optionProps }, option, state) => (
          <Box
            component="li"
            key={key}
            sx={{ display: 'flex', alignItems: 'center' }}
            {...optionProps}
          >
            {renderOptionLabel?.(option, { ...state, disabled: !!muiDisabled }) ?? (
              <CountryMenuItem countryInfo={option} />
            )}
          </Box>
        )}
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

const MUICountrySelect = MUICountrySelectInner as <
  ValueKey extends CountrySelectValueKey | undefined = undefined,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false
>(
  props: MUICountrySelectProps<ValueKey, Multiple, DisableClearable> & {
    ref?: Ref<HTMLInputElement>;
  }
) => JSX.Element;

export type { CountryISO, CountryDetails };
export { countryList };
export default MUICountrySelect;
