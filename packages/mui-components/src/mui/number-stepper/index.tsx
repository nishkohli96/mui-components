'use client';

import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react';
import MuiTextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  type FormLabelProps,
  type FormHelperTextProps,
  type TextFieldProps,
  type IconButtonProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  sanitizePastedNumber,
  setInputValueAndNotify,
  getSteppedInputValue,
  clampNumber,
  resolveMinBound,
  buildNumberInputDecimalPattern,
  useFieldIds,
  getErrorList
} from '@/utils';

type OnValueChangeProps = {
  newValue: number | null;
  event: ChangeEvent<HTMLInputElement>;
};

type TextFieldInputProps = Omit<
  TextFieldProps,
  | 'type'
  | 'multiline'
  | 'rows'
  | 'minRows'
  | 'maxRows'
  | 'onChange'
  | 'onBlur'
> & {
  /** Always an `<input>`; multiline / textarea are not supported. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

export type MUINumberStepperProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current numeric value of the field. Pass `null` or `undefined` to render an empty input.
   */
  value?: number | null;
  /**
   * Called on every valid input change with the parsed number, or `null` when the input is empty.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Parsed number value, or `null` when the input is empty.
   * @param event - Original input change event.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
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
   * When `true`, only integer values are allowed. Decimal input is blocked.
   * Cannot be used together with `maxDecimalPlaces`.
   */
  onlyIntegers?: boolean;
  /**
   * When `true`, negative and exponential values are not allowed
   * while typing or pasting. Acts as an implicit `min` of `0`.
   */
  nonNegative?: boolean;
  /**
   * Maximum number of decimal places allowed. When set, the user cannot type
   * or paste more than this number of decimal places. Cannot be used together
   * with `onlyIntegers`.
   */
  maxDecimalPlaces?: number;
  /**
   * Lower bound for the value. Stepping (buttons / arrow keys) clamps to this,
   * the value is clamped on blur, and the decrement button is disabled once the
   * bound is reached. `nonNegative` can only tighten this, never loosen it.
   */
  min?: number;
  /**
   * Upper bound for the value. Stepping (buttons / arrow keys) clamps to this,
   * the value is clamped on blur, and the increment button is disabled once the
   * bound is reached.
   */
  max?: number;
  /**
   * The amount to increase/decrease value when using the stepper buttons or arrow keys.
   * @default 1
   */
  stepAmount?: number;
  /**
   * Custom icon for the decrement (`-`) button.
   *
   * @default Remove icon
   */
  decrementIcon?: ReactNode;
  /**
   * Custom icon for the increment (`+`) button.
   *
   * @default Add icon
   */
  incrementIcon?: ReactNode;
  /**
   * Props forwarded to both internal stepper `IconButton`s. Use
   * `decrementIcon`/`incrementIcon` to swap the icons themselves; this is for
   * the buttons around them — e.g. a custom `size` or `sx`.
   */
  iconButtonProps?: IconButtonProps;
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
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & TextFieldInputProps;

/**
 * Controlled numeric `TextField` with always-visible `-` / `+` stepper buttons
 * flanking the input. Keeps `value` as a real `number | null` instead of a
 * string, with button, keyboard, and paste input all going through the same
 * sanitization path.
 *
 * Supports an integer-only mode, configurable decimal precision, a customizable
 * step amount, and optional `min` / `max` bounds that clamp stepping and
 * disable the relevant button at the limit. Rejects keystrokes and pasted
 * values that would result in invalid numbers instead of correcting them after
 * input.
 *
 * Docs: [MUINumberStepper](https://mui-components-docs.vercel.app/v1/components/mui/number-stepper)
 *
 * API: [MUINumberStepperProps](https://mui-components-docs.vercel.app/v1/components/mui/number-stepper#api)
 */
const MUINumberStepper = ({
  fieldName,
  required,
  value: muiValue,
  onValueChange,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  onlyIntegers = false,
  nonNegative = false,
  maxDecimalPlaces,
  min,
  max,
  stepAmount = 1,
  decrementIcon,
  incrementIcon,
  iconButtonProps,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  sx: muiSx,
  onBlur: muiOnBlur,
  autoComplete = defaultAutocompleteValue,
  slotProps: muiSlotProps,
  customIds,
  onKeyDown,
  onPaste,
  ...otherNumberStepperProps
}: MUINumberStepperProps) => {
  const {
    fieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const inputRef = useRef<HTMLInputElement>(null);

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

  const decimalPattern = useMemo(
    () => buildNumberInputDecimalPattern(nonNegative, onlyIntegers, maxDecimalPlaces),
    [nonNegative, onlyIntegers, maxDecimalPlaces]
  );

  const resolvedStepAmount = onlyIntegers
    ? Math.max(1, Math.floor(stepAmount))
    : stepAmount;

  const effectiveMin = resolveMinBound(nonNegative, min);
  const atMin = effectiveMin !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue <= effectiveMin;
  const atMax = max !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue >= max;
  const decrementDisabled = !!muiDisabled || atMin;
  const incrementDisabled = !!muiDisabled || atMax;

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

  const stepBy = useCallback(
    (direction: 1 | -1) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      input.focus();
      setInputValueAndNotify(
        input,
        getSteppedInputValue(
          input,
          resolvedStepAmount,
          direction,
          { nonNegative, min, max }
        )
      );
    },
    [max, min, nonNegative, resolvedStepAmount]
  );

  const handleStepButtonMouseDown = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Keep focus on the input instead of the button.
      e.preventDefault();
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        e.key === 'ArrowUp'
        || e.key === 'ArrowDown'
      ) {
        const input = e.target instanceof HTMLInputElement
          ? e.target
          : null;

        if (input) {
          e.preventDefault();
          setInputValueAndNotify(
            input,
            getSteppedInputValue(
              input,
              resolvedStepAmount,
              e.key === 'ArrowUp' ? 1 : -1,
              { nonNegative, min, max }
            )
          );
        }
      }
      if (onlyIntegers && (e.key === '.' || e.code === 'Period' || e.code === 'NumpadDecimal')) {
        e.preventDefault();
      }
      if (e.key === 'e' || e.key === 'E' || e.key === '+') {
        e.preventDefault();
      }
      if (nonNegative) {
        if (
          e.key === '-'
          || e.key === 'Subtract'
          || e.code === 'Minus'
          || e.code === 'NumpadSubtract'
        ) {
          e.preventDefault();
        }
      }
      if (
        e.key === '-'
        || e.code === 'Minus'
        || e.code === 'NumpadSubtract'
      ) {
        /**
         * Allow only one leading minus.
         * Note: selectionStart is always null for type="number" (MDN spec),
         * so cursor-position checks are unavailable. We use two proxy checks:
         *  • input.value !== '' → a valid numeric value already occupies
         *    the field; a minus at any position would be invalid
         *  • input.validity.badInput → the field is in a partial/invalid
         *    in-progress state (e.g. user has only typed "-"); a second
         *    minus would produce "--" or "-23-"
         */
        const input = e.target as HTMLInputElement;
        if (input.value !== '' || input.validity.badInput) {
          e.preventDefault();
        }
      }

      onKeyDown?.(e);
    },
    [max, min, nonNegative, onlyIntegers, onKeyDown, resolvedStepAmount]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const paste = e.clipboardData.getData('text').trim();
      if (paste !== '' && !decimalPattern.test(paste)) {
        e.preventDefault();
        const sanitized = sanitizePastedNumber(
          paste,
          nonNegative,
          onlyIntegers,
          maxDecimalPlaces
        );
        if (sanitized !== null) {
          const input = e.target instanceof HTMLInputElement ? e.target : null;
          if (input) {
            setInputValueAndNotify(input, sanitized);
          }
        }
      }
      onPaste?.(e);
    },
    [decimalPattern, maxDecimalPlaces, nonNegative, onlyIntegers, onPaste]
  );

  const handleBlur = useCallback(
    (blurEvent: FocusEvent<HTMLInputElement>) => {
      const input = blurEvent.target;
      if (input.value !== '' && !input.validity.badInput) {
        const parsed = Number(input.value);
        if (!Number.isNaN(parsed)) {
          const clamped = clampNumber(parsed, effectiveMin, max);
          if (clamped !== parsed) {
            setInputValueAndNotify(input, String(clamped));
          }
        }
      }
      muiOnBlur?.(blurEvent);
    },
    [effectiveMin, max, muiOnBlur]
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
        {...otherNumberStepperProps}
        id={fieldId}
        name={fieldName}
        type="number"
        inputRef={inputRef}
        autoComplete={autoComplete}
        label={
          !hideLabel && !isLabelAboveFormField
            ? <FormLabelText label={fieldLabel} required={required} />
            : undefined
        }
        value={
          muiValue === null || muiValue === undefined || Number.isNaN(muiValue)
            ? ''
            : muiValue
        }
        disabled={muiDisabled}
        onChange={event => {
          const changeEvent = event as ChangeEvent<HTMLInputElement>;
          const { value: inputValue, validity } = changeEvent.target;

          /**
           * type="number" reports value="" for ANY invalid input
           * (e.g. "2.3.4", "-23-", partial states). validity.badInput
           * is the only reliable way to tell "user typed something wrong"
           * apart from "user intentionally cleared the field" (MDN).
           * Returning early protects state from being wiped to null
           * when the browser silently discards an invalid intermediate value.
           */
          if (validity.badInput) {
            return;
          }

          const safeInputValue = inputValue === '' || decimalPattern.test(inputValue)
            ? inputValue
            : sanitizePastedNumber(
              inputValue,
              nonNegative,
              onlyIntegers,
              maxDecimalPlaces
            );

          if (
            safeInputValue !== null
            && (safeInputValue === '' || decimalPattern.test(safeInputValue))
          ) {
            const parsed = safeInputValue === ''
              ? null
              : (
                onlyIntegers ? parseInt(safeInputValue, 10) : Number(safeInputValue)
              );
            const safeValue = Number.isNaN(parsed) ? null : parsed;
            onValueChange({ newValue: safeValue, event: changeEvent });
          }
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        slotProps={{
          ...muiSlotProps,
          htmlInput: {
            ...muiSlotProps?.htmlInput,
            'aria-labelledby':
              !hideLabel && isLabelAboveFormField ? labelId : undefined,
            'aria-label': hideLabel ? accessibleFieldLabel : undefined,
            'aria-describedby': showHelperTextElement
              ? isError
                ? errorId
                : helperTextId
              : undefined,
            'aria-required': required,
            ...(effectiveMin !== undefined && { min: effectiveMin }),
            ...(max !== undefined && { max }),
            step: onlyIntegers
              ? resolvedStepAmount
              : 'any'
          },
          input: {
            ...muiSlotProps?.input,
            startAdornment: (
              <>
                {(muiSlotProps?.input as { startAdornment?: ReactNode })?.startAdornment}
                <InputAdornment position="start">
                  <IconButton
                    {...iconButtonProps}
                    type="button"
                    edge="start"
                    size={iconButtonProps?.size ?? 'small'}
                    aria-label="Decrease value"
                    disabled={decrementDisabled}
                    onClick={() => stepBy(-1)}
                    onMouseDown={handleStepButtonMouseDown}
                  >
                    {decrementIcon ?? <RemoveIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              </>
            ),
            endAdornment: (
              <>
                {(muiSlotProps?.input as { endAdornment?: ReactNode })?.endAdornment}
                <InputAdornment position="end">
                  <IconButton
                    {...iconButtonProps}
                    type="button"
                    edge="end"
                    size={iconButtonProps?.size ?? 'small'}
                    aria-label="Increase value"
                    disabled={incrementDisabled}
                    onClick={() => stepBy(1)}
                    onMouseDown={handleStepButtonMouseDown}
                  >
                    {incrementIcon ?? <AddIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              </>
            )
          }
        }}
        error={isError}
        sx={{
          ...muiSx,
          '& input[type=number]': {
            MozAppearance: 'textfield',
            textAlign: 'center',
            '&::-webkit-outer-spin-button': { display: 'none' },
            '&::-webkit-inner-spin-button': { display: 'none' },
          },
        }}
        multiline={false}
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

export default MUINumberStepper;
