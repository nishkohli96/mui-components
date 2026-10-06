'use client';

import {
  useContext,
  type ReactNode,
  type ChangeEvent,
  type FocusEvent
} from 'react';
import TextField from '@mui/material/TextField';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  type FormLabelProps,
  type FormHelperTextProps,
  type TextFieldProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  getErrorList,
  keepLabelAboveFormField,
  useFieldIds
} from '@/utils';

type OnValueChangeProps = {
  newValue: string;
  event: ChangeEvent<HTMLTextAreaElement>;
};

export type MUITextAreaProps = {
  /**
	 * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
	 */
  fieldName: string;
  /**
	 * Current value of the field.
	 *
	 * `undefined`/`null` are treated as an empty string.
	 */
  value?: string | null;
  /**
	 * Called on every input change with the next string value and the original change event.
	 * Call your state setter (or form library's setter) with `newValue` to update `value`.
	 *
	 * @param newValue - Next input string.
	 * @param event - Original input change event.
	 */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
  /**
	 * Maximum number of characters the field accepts. Typing and pasting stop
	 * at this limit — pasted text is cut to fit — via the native `maxLength`
	 * attribute, so it also applies to assistive tech and mobile keyboards.
	 *
	 * Counts UTF-16 code units, so a single emoji counts as 2. A value set
	 * programmatically through `value` is not truncated.
	 */
  maxChars?: number;
  /**
	 * When `true`, renders the field label above the form field instead of inside or beside it.
	 */
  showLabelAboveFormField?: boolean;
  /**
	 * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
	 */
  formLabelProps?: Omit<FormLabelProps, 'id'>;
  /**
	 * When `true`, hides the rendered field label while preserving accessible labeling where possible.
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
	 * If `true`, hides the error message text while keeping the field in an error state.
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
} & Omit<TextFieldProps, 'multiline'>;

/**
 * Controlled wrapper around MUI's `TextField`, wired to a `fieldName` and
 * `value`/`onValueChange` pair instead of raw MUI input events.
 *
 * Handles label placement, single/multi-message error display, and helper
 * text out of the box, so callers don't have to wire `FormHelperText`/error
 * state by hand.
 *
 * Docs: [MUITextArea](https://mui-components-docs.vercel.app/components/mui/text-area)
 *
 * API: [MUITextAreaProps](https://mui-components-docs.vercel.app/components/mui/text-area#api)
 */
const MUITextArea = ({
  fieldName,
  required,
  value: muiValue,
  onValueChange,
  maxChars,
  onBlur: muiOnBlur,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  autoComplete = defaultAutocompleteValue,
  slotProps: muiSlotProps,
  /**
	 * Unless the rows prop is set, the height of the text field
	 * dynamically matches its content.
	 */
  rows,
  customIds,
  ...otherTextAreaProps
}: MUITextAreaProps) => {
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
      <TextField
        {...otherTextAreaProps}
        id={fieldId}
        name={fieldName}
        autoComplete={autoComplete}
        label={
          !hideLabel && !isLabelAboveFormField
            ? <FormLabelText label={fieldLabel} required={required} />
            : undefined
        }
        value={muiValue ?? ''}
        onChange={event => {
          const changeEvent = event as ChangeEvent<HTMLTextAreaElement>;
          const newValue = changeEvent.target.value;
          onValueChange({ newValue, event: changeEvent });
        }}
        onBlur={event => {
          const blurEvent = event as FocusEvent<HTMLTextAreaElement, Element>;
          muiOnBlur?.(blurEvent);
        }}
        multiline
        rows={rows}
        error={isError}
        disabled={muiDisabled}
        slotProps={{
          ...muiSlotProps,
          htmlInput: {
            ...muiSlotProps?.htmlInput,
            ...(maxChars !== undefined && { maxLength: maxChars }),
            'aria-labelledby': !hideLabel && isLabelAboveFormField ? labelId : undefined,
            'aria-label': hideLabel ? accessibleFieldLabel : undefined,
            'aria-describedby': showHelperTextElement ? (isError ? errorId : helperTextId) : undefined,
            'aria-required': required
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

export default MUITextArea;
