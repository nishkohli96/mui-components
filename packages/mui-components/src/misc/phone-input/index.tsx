/**
 * Code Reference -
 * https://react-international-phone.vercel.app/docs/Advanced%20Usage/useWithUiLibs
 */

'use client';

import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type Ref
} from 'react';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
  type CountryData,
  type CountryIso2,
  type ParsedCountry,
  type UsePhoneInputConfig
} from 'react-international-phone';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  type FormLabelProps,
  type FormHelperTextProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  mergeRefs,
  useFieldIds,
  parseErrorInput,
  type FieldErrorInput
} from '@/utils';
import CountryMenuItem from './CountryMenuItem';
import 'react-international-phone/style.css';

type PhoneInputChangeReturnValue = {
  phone: string;
  inputValue: string;
  country: ParsedCountry;
};

const countryMenuWidth = 350;
const countryMenuLeftOffset = -34;
const countryMenuViewportGutter = 32;

export type MUIPhoneInputValue = {
  /** Full E.164-style phone value with dial code, e.g. "+15551234567". */
  phone: string;
  /** Selected ISO 3166-1 alpha-2 country code, e.g. "us" or "ca". */
  country: CountryIso2;
  /** Country calling code without the "+" prefix, e.g. "1". */
  dialCode: string;
  /** National significant number with the dial code stripped. */
  phoneNo: string;
};

type MUIPhoneInputOnValueChangeProps = {
  /** Structured value emitted by the phone input. */
  newValue: MUIPhoneInputValue;
  /** Raw change payload returned by `react-international-phone`. */
  phoneData: PhoneInputChangeReturnValue;
};

type InputTextFieldProps = Omit<
  TextFieldProps,
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'error'
  | 'inputRef'
  | 'type'
  | 'FormHelperTextProps'
  | 'ref'
>;

type SearchCountryProps = {
  /**
   * Whether to show the inline country search field inside the country dropdown.
   * @default true
   */
  allowCountrySearch?: boolean;
  /**
   * Props forwarded to the internal MUI `TextField`.
   */
  textFieldProps?: Omit<TextFieldProps, 'value' | 'label'>;
  /**
   * Customize the content of each `MenuItem` in the country search dropdown.
   */
  renderCountryMenuItem?: (country: ParsedCountry) => ReactNode;
  /**
   * Text shown when the country search does not match any available country.
   * @default 'No countries found'
   */
  noCountryFoundText?: string;
};

type PhoneInputProps = Omit<UsePhoneInputConfig, 'value' | 'onChange'>;

function toStructuredValue(
  phoneData: PhoneInputChangeReturnValue
): MUIPhoneInputValue {
  const { phone, country } = phoneData;
  const phoneNo = phone.startsWith(`+${country.dialCode}`)
    ? phone.slice(country.dialCode.length + 1)
    : phone;

  return {
    phone,
    country: country.iso2,
    dialCode: country.dialCode,
    phoneNo
  };
}

function getPhoneValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'phone' in value) {
    return String(value.phone ?? '');
  }

  return undefined;
}

export type MUIPhoneInputProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current phone value. You may initialize it with a phone string, but
   * `onValueChange` always emits the structured `MUIPhoneInputValue` shape.
   * `undefined`/`null` start the input empty with the default country.
   */
  value?: MUIPhoneInputValue | string | null;
  /**
   * Called after the phone value is normalized.
   */
  onValueChange: ({
    newValue,
    phoneData
  }: MUIPhoneInputOnValueChangeProps) => void;
  /**
   * Options for the inline country search field in the country dropdown.
   */
  searchCountryProps?: SearchCountryProps;
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
   * Validation error for the field, accepted in whatever shape your form
   * library provides — a message string, an `Error`/`FieldError`-like object
   * with a `message`, or an array of either (every resolvable message is
   * kept, so multiple failed rules can be shown together).
   *
   * Any non-empty input puts the field into an error state and the resolved
   * message(s) are surfaced through `FormHelperText`. Pass `true` to force the
   * error state without a message; `undefined`/`null`/`false`/`''`/`[]` clear it.
   *
   * Use `renderError` to customize how the resolved messages are rendered.
   */
  errorMessage?: FieldErrorInput;
  /**
   * Custom renderer for the resolved error message(s). Receives every message
   * parsed from `errorMessage` (called only when at least one resolves) and
   * must return renderable content — e.g. `errors[0]`, or a list when a field
   * can fail multiple rules at once.
   *
   * When omitted, a single message renders as plain text and multiple
   * messages render on separate lines.
   *
   * @param errors - Resolved error messages for this field.
   */
  renderError?: (errors: string[]) => ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * Configuration passed to `react-international-phone`'s `usePhoneInput` hook.
   */
  phoneInputProps?: PhoneInputProps;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & InputTextFieldProps;

const MUIPhoneInput = forwardRef(function MUIPhoneInput(
  {
    fieldName,
    value,
    onValueChange,
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
    disabled: muiDisabled,
    phoneInputProps,
    slotProps,
    onBlur,
    autoComplete = defaultAutocompleteValue,
    customIds,
    searchCountryProps,
    ...otherPhoneInputPropsForTextField
  }: MUIPhoneInputProps,
  ref: Ref<HTMLInputElement>
) {
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );
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

  const currentPhoneValue = getPhoneValue(value);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryMenuLeft, setCountryMenuLeft] = useState(0);
  const phoneInputRootRef = useRef<HTMLDivElement | null>(null);

  const {
    countries,
    preferredCountries,
    forceDialCode,
    ...otherPhoneInputProps
  } = phoneInputProps ?? {};
  const countryOptions = countries ?? defaultCountries;

  const {
    textFieldProps: searchCountryTextFieldProps,
    allowCountrySearch = true,
    renderCountryMenuItem,
    noCountryFoundText = 'No countries found'
  } = searchCountryProps ?? {};

  const {
    id: searchCountryTextFieldId = `${fieldName}_search-country`,
    fullWidth: searchCountryFullWidth = true,
    size: searchCountrySize = 'small',
    placeholder: searchCountryPlaceholder = 'Search by country or dial code',
    onChange: searchCountryOnChange,
    onClick: searchCountryOnClick,
    onKeyDown: searchCountryOnKeyDown,
    ...otherSearchCountryTextFieldProps
  } = searchCountryTextFieldProps ?? {};

  const updateCountryMenuLeft = () => {
    const inputWidth = phoneInputRootRef.current?.offsetWidth ?? 0;
    const hasViewportRoom
      = window.innerWidth
        > countryMenuWidth
        + Math.abs(countryMenuLeftOffset)
        + countryMenuViewportGutter;

    setCountryMenuLeft(
      inputWidth > countryMenuWidth && hasViewportRoom
        ? countryMenuLeftOffset
        : 0
    );
  };

  useEffect(() => {
    updateCountryMenuLeft();
    window.addEventListener('resize', updateCountryMenuLeft);
    return () => {
      window.removeEventListener('resize', updateCountryMenuLeft);
    };
  }, []);

  const { countriesToList, countriesToListAtTop } = useMemo(() => {
    if (!preferredCountries?.length) {
      return {
        countriesToList: countryOptions,
        countriesToListAtTop: [] as CountryData[]
      };
    }

    const countriesToListAtTop = countryOptions
      .filter(country =>
        preferredCountries.includes(parseCountry(country).iso2))
      .sort(
        (a, b) =>
          preferredCountries.indexOf(parseCountry(a).iso2)
          - preferredCountries.indexOf(parseCountry(b).iso2)
      );

    const countriesToList = countryOptions.filter(
      country => !preferredCountries.includes(parseCountry(country).iso2)
    );

    return { countriesToList, countriesToListAtTop };
  }, [countryOptions, preferredCountries]);

  const filterCountry = (countryData: CountryData) => {
    const search = countrySearch.trim().toLowerCase();
    if (!search) {
      return true;
    }

    const countryInfo = parseCountry(countryData);
    const dialCodeSearch = search.replace('+', '');

    return (
      countryInfo.name.toLowerCase().includes(search)
      || countryInfo.iso2.toLowerCase().includes(search)
      || countryInfo.dialCode.includes(dialCodeSearch)
    );
  };

  const filteredCountriesToListAtTop
    = countriesToListAtTop.filter(filterCountry);
  const filteredCountriesToList = countriesToList.filter(filterCountry);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry }
    = usePhoneInput({
      ...otherPhoneInputProps,
      value: currentPhoneValue,
      onChange: (phoneData: PhoneInputChangeReturnValue) => {
        onValueChange({
          newValue: toStructuredValue(phoneData),
          phoneData
        });
      },
      countries: countryOptions,
      preferredCountries,
      forceDialCode
    });

  const { isError, errorMessages } = parseErrorInput(errorMessage);
  const fieldErrorMessage = errorMessages.length > 0
    ? renderError?.(errorMessages) ?? (
      errorMessages.length === 1
        ? errorMessages[0]
        : errorMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))
    )
    : undefined;
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  const startAdornment = (
    <InputAdornment
      position="start"
      style={{ marginRight: '2px', marginLeft: '-8px' }}
    >
      <Select
        MenuProps={{
          autoFocus: false,
          PaperProps: {
            sx: {
              width: `min(${countryMenuWidth}px, calc(100vw - 32px))`,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 300
            }
          },
          MenuListProps: {
            sx: {
              pt: allowCountrySearch ? 0 : '8px'
            }
          },
          style: {
            top: '10px',
            left: countryMenuLeft
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          }
        }}
        sx={{
          width: 'max-content',
          fieldset: {
            display: 'none'
          },
          '&.Mui-focused:has(div[aria-expanded="false"])': {
            fieldset: {
              display: 'block'
            }
          },
          '.MuiSelect-select': {
            padding: '8px',
            paddingRight: '24px !important'
          },
          svg: {
            right: 0
          }
        }}
        value={country.iso2}
        disabled={muiDisabled || forceDialCode}
        onOpen={updateCountryMenuLeft}
        onClose={() => {
          setCountrySearch('');
        }}
        onChange={e => {
          setCountry(e.target.value, { focusOnInput: true });
        }}
        renderValue={selectedValue => (
          <FlagImage iso2={selectedValue} style={{ display: 'flex' }} />
        )}
      >
        {allowCountrySearch && (
          <ListSubheader
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
              lineHeight: 'normal',
              padding: '8px',
            }}
          >
            <MuiTextField
              {...otherSearchCountryTextFieldProps}
              label={null}
              id={searchCountryTextFieldId}
              fullWidth={searchCountryFullWidth}
              placeholder={searchCountryPlaceholder}
              size={searchCountrySize}
              value={countrySearch}
              onChange={event => {
                setCountrySearch(event.target.value);
                searchCountryOnChange?.(event);
              }}
              onClick={event => {
                event.stopPropagation();
                searchCountryOnClick?.(event);
              }}
              onKeyDown={event => {
                event.stopPropagation();
                searchCountryOnKeyDown?.(event);
              }}
            />
          </ListSubheader>
        )}
        {filteredCountriesToListAtTop.map(c => {
          const countryInfo = parseCountry(c);
          return (
            <MenuItem key={countryInfo.iso2} value={countryInfo.iso2}>
              {renderCountryMenuItem?.(countryInfo) ?? <CountryMenuItem country={countryInfo} />}
            </MenuItem>
          );
        })}
        {filteredCountriesToListAtTop.length > 0
          && filteredCountriesToList.length > 0
          && <Divider />}
        {filteredCountriesToList.map(c => {
          const countryInfo = parseCountry(c);
          return (
            <MenuItem key={countryInfo.iso2} value={countryInfo.iso2}>
              {renderCountryMenuItem?.(countryInfo) ?? <CountryMenuItem country={countryInfo} />}
            </MenuItem>
          );
        })}
        {filteredCountriesToListAtTop.length === 0
          && filteredCountriesToList.length === 0 && (
          <MenuItem disabled>
            {noCountryFoundText}
          </MenuItem>
        )}
      </Select>
    </InputAdornment>
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
      <MuiTextField
        {...otherPhoneInputPropsForTextField}
        ref={phoneInputRootRef}
        id={fieldId}
        name={fieldName}
        inputRef={mergeRefs(inputRef, ref)}
        value={inputValue}
        autoComplete={autoComplete}
        type="tel"
        onChange={handlePhoneValueChange}
        onBlur={onBlur}
        label={
          !hideLabel && !isLabelAboveFormField
            ? (
              <FormLabelText label={fieldLabel} required={required} />
            )
            : undefined
        }
        aria-labelledby={
          !hideLabel && isLabelAboveFormField ? labelId : undefined
        }
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
        aria-required={required}
        error={isError}
        disabled={muiDisabled}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment
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

export default MUIPhoneInput;
