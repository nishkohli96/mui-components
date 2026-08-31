'use client';

import {
  Fragment,
  useContext,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import Box from '@mui/material/Box';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type FormLabelProps,
  type FormHelperTextProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  useFieldIds,
  getErrorList
} from '@/utils';

type OTPChangeEvent
  = | ChangeEvent<HTMLInputElement>
    | KeyboardEvent<HTMLInputElement>
    | ClipboardEvent<HTMLInputElement>;

type OnValueChangeProps = {
  /** Full code as a single string, `length` characters, no separators. */
  newValue: string;
  /** Original event that triggered the change — a keystroke, backspace, or paste. */
  event: OTPChangeEvent;
};

/**
 * Props forwarded to each individual character `TextField`. Anything the
 * component itself derives or controls per-box is omitted: `name`/`id`
 * (generated per index from `fieldName`), `value`/`onChange`/`onKeyDown`/
 * `onPaste` (own the character-entry, navigation and paste-distribution
 * logic), `error` (derived from `errorMessage`), `multiline`/`rows`/
 * `minRows`/`maxRows` (always a single-line box), and `inputRef`/`ref`
 * (used internally for focus management).
 */
type OTPTextFieldProps = Omit<
  TextFieldProps,
  | 'name'
  | 'id'
  | 'value'
  | 'onChange'
  | 'onKeyDown'
  | 'onPaste'
  | 'error'
  | 'multiline'
  | 'rows'
  | 'minRows'
  | 'maxRows'
  | 'inputRef'
  | 'ref'
>;

export type MUIOTPInputProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current code value, as a single string with no separators (e.g. `'123456'`).
   *
   * `undefined` is treated as an empty code.
   */
  value?: string;
  /**
   * Called after every character entry, deletion, or paste with the next
   * full code string. Call your state setter (or form library's setter)
   * with `newValue` to update `value`.
   *
   * @param newValue - Next code string, always `length` characters or fewer.
   * @param event - Original keystroke, backspace, or paste event.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
  /**
   * Number of characters in the verification code. One `TextField` box is
   * rendered per character.
   * @default 6
   */
  length?: number;
  /**
   * Zero-based character indexes after which a separator is rendered.
   *
   * For example, `[2, 6]` with `length={10}` renders as
   * `*** - **** - ***` (a separator after the 3rd and 7th boxes).
   */
  separatorIndexes?: number[];
  /**
   * Content rendered at each `separatorIndexes` position.
   * @default '-'
   */
  separator?: ReactNode;
  /**
   * When `true`, each box accepts letters and digits. By default,
   * only digits can be typed or pasted — a non-digit keystroke
   * or paste is ignored.
   * @default false
   */
  alphanumeric?: boolean;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Label content for the field. Defaults to a label generated from `fieldName`.
   *
   * The label is hidden by default; set `showLabelAboveFormField` (or the
   * `allLabelsAboveFields` config) to render it above the boxes. Even while
   * hidden it still names each box for assistive tech.
   */
  label?: ReactNode;
  /**
   * Renders the field label above the boxes. The label is otherwise hidden —
   * there is no inline label. Pass `false` to also opt out of the
   * `allLabelsAboveFields` config for this field.
   */
  showLabelAboveFormField?: boolean;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: Omit<FormLabelProps, 'id'>;
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
   * Disables every character box and prevents input.
   * @default false
   */
  disabled?: boolean;
  /**
   * When true, focuses the first empty box (or the first box, if the code
   * is already complete) on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Props forwarded to every internal MUI `TextField` character box — e.g.
   * a custom `size`, `variant` or `sx`.
   */
  textFieldProps?: OTPTextFieldProps;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

/**
 * Controlled one-time-password input rendered as N individual MUI
 * `TextField` boxes, default `6`, backed by a single string value.
 *
 * Typing, backspace, arrow keys and pasting a full code all work the way
 * users expect — pasting distributes characters across the remaining boxes
 * starting from wherever the cursor is.
 *
 * Only digits are accepted unless `alphanumeric` is set.
 *
 * Docs: [MUIOTPInput](https://mui-components-docs.vercel.app/components/mui/otp-input)
 *
 * API: [MUIOTPInputProps](https://mui-components-docs.vercel.app/components/mui/otp-input#api)
 */
const MUIOTPInput = ({
  fieldName,
  value,
  onValueChange,
  length = 6,
  separatorIndexes,
  separator = '-',
  alphanumeric = false,
  required,
  label,
  showLabelAboveFormField,
  formLabelProps,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  disabled: muiDisabled,
  autoFocus,
  textFieldProps,
  customIds
}: MUIOTPInputProps) => {
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

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const inputValueChars = Array.from({ length }, (_, index) => value?.[index] ?? '');

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
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  /**
   * Anchored so a typed or pasted string is accepted only when *every*
   * character is allowed — pasting `w2323s` into a numeric field is rejected
   * outright rather than filtered down to `2323`.
   */
  const allowedInputPattern = alphanumeric ? (/^[a-z0-9]+$/i) : (/^[0-9]+$/);

  const emitChange = (newChars: string[], event: OTPChangeEvent) => {
    onValueChange({ newValue: newChars.join(''), event });
  };

  /**
   * Writes `rawInput` (a single keystroke or a full pasted string) starting at
   * `index`, then focuses past the last character written.
   */
  const applyInputAtIndex = (
    index: number,
    rawInput: string,
    event: OTPChangeEvent
  ) => {
    if (!allowedInputPattern.test(rawInput)) {
      return;
    }

    const newChars = [...inputValueChars];
    let cursor = index;
    for (const char of rawInput) {
      if (cursor >= length) {
        break;
      }
      newChars[cursor] = char;
      cursor += 1;
    }
    emitChange(newChars, event);
    inputRefs.current[Math.min(cursor, length - 1)]?.focus();
  };

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    if (rawInput === '') {
      const newChars = [...inputValueChars];
      newChars[index] = '';
      emitChange(newChars, event);
      return;
    }
    applyInputAtIndex(index, rawInput, event);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !inputValueChars[index] && index > 0) {
      event.preventDefault();
      const newChars = [...inputValueChars];
      newChars[index - 1] = '';
      emitChange(newChars, event);
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
   * Handled explicitly (rather than left to `onChange`) because the native
   * `maxLength={1}` on each box truncates a pasted multi-character string
   * down to one character before `onChange` ever sees it.
   */
  const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    applyInputAtIndex(index, event.clipboardData.getData('text'), event);
  };

  /* Select the existing character so typing replaces it instead of appending. */
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <FormControl error={isError} disabled={muiDisabled}>
      <FormLabel
        label={fieldLabel}
        isVisible={isLabelAboveFormField}
        required={required}
        error={isError}
        disabled={muiDisabled}
        formLabelProps={{
          ...formLabelProps,
          id: labelId,
          htmlFor: `${fieldId}-0`
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {inputValueChars.map((char, index) => (
          <Fragment key={index}>
            <MuiTextField
              {...textFieldProps}
              id={`${fieldId}-${index}`}
              name={`${fieldName}-${index}`}
              value={char}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste(index)}
              onFocus={handleFocus}
              disabled={muiDisabled}
              error={isError}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autoFocus && index === Math.min(value?.length ?? 0, length - 1)}
              inputRef={el => {
                inputRefs.current[index] = el;
              }}
              sx={{ width: 48, ...textFieldProps?.sx }}
              slotProps={{
                ...textFieldProps?.slotProps,
                htmlInput: {
                  style: { textAlign: 'center' },
                  ...textFieldProps?.slotProps?.htmlInput,
                  maxLength: 1,
                  inputMode: alphanumeric ? 'text' : 'numeric',
                  'aria-labelledby': isLabelAboveFormField ? labelId : undefined,
                  'aria-label': `${accessibleFieldLabel} — character ${index + 1} of ${length}`,
                  'aria-describedby': showHelperTextElement
                    ? (isError ? errorId : helperTextId)
                    : undefined,
                  'aria-required': required
                }
              }}
            />
            {separatorIndexes?.includes(index) && index < length - 1 && (
              <Box
                component="span"
                aria-hidden
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                {separator}
              </Box>
            )}
          </Fragment>
        ))}
      </Box>
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

export default MUIOTPInput;
