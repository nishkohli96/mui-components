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
import Box from '@mui/material/Box';
import Paper, { type PaperProps } from '@mui/material/Paper';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Select, { type SelectProps as MuiSelectProps } from '@mui/material/Select';
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
  type FormHelperTextProps,
  type MenuItemProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  mergeRefs,
  mergeSx,
  useFieldIds,
  getErrorList
} from '@/utils';
import CountryMenuItem from './CountryMenuItem';
import 'react-international-phone/style.css';

const countryMenuWidth = 350;
/*
 * Defensive-only: the menu is anchored to the field itself and capped at the
 * field's own width, so it can never overflow the field's box. This gutter
 * only guards the (rare) case where the field's own layout already pushes it
 * flush against the viewport edge, e.g. a full-width field with no side margin.
 */
const countryMenuViewportGutter = 32;
const countryMenuMaxHeight = 300;

/**
 * Custom `Paper` for `MenuProps.slots.paper`.
 *
 * `Select` needs `MenuItem`s as direct children to wire up selection, so
 * the search field lives here instead — above a scrollable wrapper around
 * `children` (the `MenuList`), so the scrollbar starts below the search
 * field, not alongside it.
 *
 * `position: 'absolute'` re-adds what MUI's default Popover `Paper` normally
 * bakes in; without it, Popover's `top`/`left` positioning is ignored.
 */
const CountryMenuPaper = forwardRef<
  HTMLDivElement,
  PaperProps & { searchElement?: ReactNode }
>(function CountryMenuPaper({ searchElement, children, sx, ...paperProps }, ref) {
  return (
    <Paper
      ref={ref}
      {...paperProps}
      sx={mergeSx({ position: 'absolute', outline: 0 }, sx)}
    >
      {searchElement}
      <Box sx={{ overflowY: 'auto', maxHeight: countryMenuMaxHeight }}>
        {children}
      </Box>
    </Paper>
  );
});

type PhoneInputChangeReturnValue = {
  phone: string;
  inputValue: string;
  country: ParsedCountry;
};

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
  /**
   * Props forwarded to every rendered country `MenuItem` — including the
   * disabled "no results" item shown when `noCountryFoundText` applies.
   */
  menuItemProps?: MenuItemProps;
};

type PhoneInputProps = Omit<UsePhoneInputConfig, 'value' | 'onChange'>;

/**
 * Props forwarded to the internal MUI `Select` that renders the flag/dial-code
 * trigger and country dropdown.
 */
type CountrySelectProps = Omit<
  MuiSelectProps,
  | 'value'
  | 'defaultValue'
  | 'multiple'
  | 'onChange'
  | 'onOpen'
  | 'onClose'
  | 'multiline'
  | 'renderValue'
  | 'MenuProps'
  | 'disabled'
  | 'children'
  | 'ref'
>;

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
   * Props forwarded to the internal MUI `Select` that renders the flag/dial-code
   * trigger and country dropdown — e.g. a custom `size` or `sx` (merged with
   * the component's own).
   */
  countrySelectProps?: CountrySelectProps;
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
    countrySelectProps,
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
  const [countryMenuWidthPx, setCountryMenuWidthPx] = useState(countryMenuWidth);
  const [countryMenuAnchorEl, setCountryMenuAnchorEl] = useState<HTMLDivElement | null>(null);
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
    noCountryFoundText = 'No countries found',
    menuItemProps
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

  const updateCountryMenuLayout = () => {
    const inputWidth = phoneInputRootRef.current?.offsetWidth ?? 0;

    /*
     * Cap the menu at the field width so a narrow field (e.g. `md={6}`) doesn't
     * let the fixed 350px menu spill into the adjacent grid column. When the
     * field is wider than the menu, keep the full `countryMenuWidth`. The menu
     * is anchored directly to the field itself (see `anchorEl` below), so its
     * right edge never exceeds the field's own right edge on any viewport width.
     */
    setCountryMenuWidthPx(
      inputWidth > 0 ? Math.min(countryMenuWidth, inputWidth) : countryMenuWidth
    );
  };

  useEffect(() => {
    setCountryMenuAnchorEl(phoneInputRootRef.current);
    updateCountryMenuLayout();
    window.addEventListener('resize', updateCountryMenuLayout);
    return () => {
      window.removeEventListener('resize', updateCountryMenuLayout);
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

  const hasVisibleCountriesAtTop = countriesToListAtTop.some(filterCountry);
  const hasVisibleCountries = countriesToList.some(filterCountry);

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

  const startAdornment = (
    <InputAdornment
      position="start"
      style={{ marginRight: '2px', marginLeft: '-8px' }}
    >
      <Select
        {...countrySelectProps}
        multiple={false}
        multiline={false}
        MenuProps={{
          autoFocus: false,
          /*
           * Anchor the menu to the whole field (not the small flag trigger
           * it sits inside) so its left edge lines up with the field's left
           * edge on every viewport width, with no manual offset math needed.
           * Read from state (set once the ref mounts) rather than the ref
           * directly — a ref populating doesn't trigger a re-render on its
           * own, so `MenuProps` built during the initial render would
           * otherwise permanently omit `anchorEl` whenever nothing else
           * happens to force a re-render first.
           */
          ...(countryMenuAnchorEl && { anchorEl: countryMenuAnchorEl }),
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          },
          slots: {
            paper: CountryMenuPaper
          },
          slotProps: {
            paper: {
              sx: {
                mt: '4px',
                width: `min(${countryMenuWidthPx}px, calc(100vw - ${countryMenuViewportGutter}px))`,
                maxWidth: `calc(100vw - ${countryMenuViewportGutter}px)`
              },
              searchElement: allowCountrySearch && (
                <Box
                  sx={{
                    flexShrink: 0,
                    bgcolor: 'background.paper',
                    lineHeight: 'normal',
                    padding: '8px'
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
                  <Divider sx={{ mt: '8px', mx: '-8px' }} />
                </Box>
              )
            } as PaperProps & { searchElement?: ReactNode },
            list: {
              sx: {
                pt: '8px'
              }
            }
          }
        }}
        sx={mergeSx(
          {
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
          },
          countrySelectProps?.sx
        )}
        value={country.iso2}
        disabled={muiDisabled || forceDialCode}
        onOpen={() => {
          updateCountryMenuLayout();
          setCountrySearch('');
        }}
        onChange={e => {
          setCountry(e.target.value, { focusOnInput: true });
        }}
        renderValue={selectedValue => (
          <FlagImage iso2={selectedValue} style={{ display: 'flex' }} />
        )}
      >
        {countriesToListAtTop.map(c => {
          const countryInfo = parseCountry(c);
          return (
            <MenuItem
              {...menuItemProps}
              key={countryInfo.iso2}
              value={countryInfo.iso2}
              sx={mergeSx(
                { display: filterCountry(c) ? undefined : 'none' },
                menuItemProps?.sx
              )}
            >
              {renderCountryMenuItem?.(countryInfo) ?? <CountryMenuItem country={countryInfo} />}
            </MenuItem>
          );
        })}
        {countriesToListAtTop.length > 0
          && countriesToList.length > 0
          && (
            <Divider
              sx={{
                display: hasVisibleCountriesAtTop && hasVisibleCountries ? undefined : 'none'
              }}
            />
          )}
        {countriesToList.map(c => {
          const countryInfo = parseCountry(c);
          return (
            <MenuItem
              {...menuItemProps}
              key={countryInfo.iso2}
              value={countryInfo.iso2}
              sx={mergeSx(
                { display: filterCountry(c) ? undefined : 'none' },
                menuItemProps?.sx
              )}
            >
              {renderCountryMenuItem?.(countryInfo) ?? <CountryMenuItem country={countryInfo} />}
            </MenuItem>
          );
        })}
        {/*
         * Every country stays mounted as a `MenuItem` (just hidden via
         * `display: none` when filtered out) instead of being filtered out
         * of `Select`'s children — MUI warns/misbehaves when the currently
         * selected `value` has no matching child, which searching away the
         * selected country's item would otherwise trigger on every keystroke.
         */}
        <MenuItem
          {...menuItemProps}
          disabled
          sx={mergeSx(
            { display: hasVisibleCountriesAtTop || hasVisibleCountries ? 'none' : undefined },
            menuItemProps?.sx
          )}
        >
          {noCountryFoundText}
        </MenuItem>
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
        id={fieldId}
        name={fieldName}
        ref={phoneInputRootRef}
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
