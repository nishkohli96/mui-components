'use client';

import {
  useContext,
  forwardRef,
  type Ref,
  type ReactNode
} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateTimePicker as MuiDateTimePicker,
  type DateTimePickerProps,
  type DateTimeValidationError,
  type PickerChangeHandlerContext
} from '@mui/x-date-pickers';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  type FormLabelProps,
  type FormHelperTextProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  generateDateAdapterErrMsg,
  keepLabelAboveFormField,
  useFieldIds,
  parseErrorInput,
  type FieldErrorInput
} from '@/utils';

type DateTimePickerInputProps = Omit<
  DateTimePickerProps,
  'name' | 'defaultValue' | 'inputRef' | 'onChange'
>;

type DateTimePickerValue = Parameters<
  NonNullable<DateTimePickerProps['onChange']>
>[0];

type PickerOnValueChangeProps<ValidationError> = {
  newValue: DateTimePickerValue;
  context: PickerChangeHandlerContext<ValidationError>;
};

export type MUIDateTimePickerProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Called after the default handler accepts a valid date-time value.
   *
   * @param newValue - New date-time value emitted by MUI X.
   * @param context - MUI X picker change context, including validation status.
   */
  onValueChange: ({
    newValue,
    context
  }: PickerOnValueChangeProps<DateTimeValidationError>) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
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
   * Helper text shown below the field when there is no visible validation error.
   */
  helperText?: ReactNode;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & DateTimePickerInputProps;

const MUIDateTimePicker = forwardRef(function MUIDateTimePicker(
  {
    fieldName,
    value: muiValue,
    onValueChange,
    required,
    onAccept: muiOnAccept,
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
    slotProps: muiSlotProps,
    customIds,
    ...otherPickerProps
  }: MUIDateTimePickerProps,
  ref: Ref<HTMLInputElement>
) {
  const { dateAdapter, allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  if (!dateAdapter) {
    throw new Error(generateDateAdapterErrMsg('MUIDateTimePicker'));
  }

  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );
  const { textField: textFieldSlotProps, ...otherSlotProps }
    = muiSlotProps ?? {};

  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const fieldLabel = label ?? fieldNameToLabel(fieldName);
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : fieldNameToLabel(fieldName);
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

  return (
    <LocalizationProvider dateAdapter={dateAdapter}>
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
        <MuiDateTimePicker
          {...otherPickerProps}
          name={fieldName}
          inputRef={ref}
          value={muiValue ?? null}
          disabled={muiDisabled}
          closeOnSelect={false}
          onChange={(newValue, context) => {
            onValueChange({ newValue, context });
          }}
          onAccept={(newValue, context) => {
            muiOnAccept?.(newValue, context);
          }}
          label={
            !hideLabel && !isLabelAboveFormField
              ? (
                <FormLabelText label={fieldLabel} required={required} />
              )
              : undefined
          }
          slotProps={{
            ...otherSlotProps,
            textField: ownerState => {
              const resolvedTextFieldSlotProps = typeof textFieldSlotProps === 'function'
                ? textFieldSlotProps(ownerState)
                : textFieldSlotProps;
              return {
                ...resolvedTextFieldSlotProps,
                id: fieldId,
                error: isError,
                inputProps: {
                  ...resolvedTextFieldSlotProps?.inputProps,
                  'aria-labelledby': !hideLabel && isLabelAboveFormField
                    ? labelId
                    : undefined,
                  'aria-label': hideLabel
                    ? accessibleFieldLabel
                    : undefined,
                  'aria-describedby': showHelperTextElement
                    ? isError
                      ? errorId
                      : helperTextId
                    : undefined,
                  'aria-invalid': isError || undefined,
                  'aria-required': required || undefined,
                }
              };
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
    </LocalizationProvider>
  );
});

export default MUIDateTimePicker;
