'use client';

import {
  useContext,
  forwardRef,
  type Ref,
  type ReactNode
} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  StaticDatePicker as MuiStaticDatePicker,
  type StaticDatePickerProps,
  type DateValidationError,
  type PickerChangeHandlerContext
} from '@mui/x-date-pickers';
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
  generateDateAdapterErrMsg,
  keepLabelAboveFormField,
  useFieldIds,
  parseErrorInput,
  type FieldErrorInput
} from '@/utils';

type StaticDatePickerInputProps = Omit<
  StaticDatePickerProps,
  'ref' | 'onChange'
>;

type StaticDatePickerValue = Parameters<
  NonNullable<StaticDatePickerProps['onChange']>
>[0];

type PickerOnValueChangeProps<ValidationError> = {
  newValue: StaticDatePickerValue;
  context: PickerChangeHandlerContext<ValidationError>;
};

export type MUIStaticDatePickerProps = {
  /**
   * Name/path of the field. Used to derive generated ids and the default label.
   */
  fieldName: string;
  /**
   * Called after the default handler accepts a valid date value.
   */
  onValueChange: ({
    newValue,
    context
  }: PickerOnValueChangeProps<DateValidationError>) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
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
   * Validation error for the field, accepted in whatever shape your form
   * library provides — a message string, an `Error`/`FieldError`-like object
   * with a `message`, or an array of either (every resolvable message is
   * kept, so multiple failed rules can be shown together).
   *
   * Any non-empty input puts the field into an error state and the resolved
   * message(s) are surfaced through `FormHelperText`;
   * `undefined`/`null`/`false`/`''`/`[]` clear it.
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
} & StaticDatePickerInputProps;

const MUIStaticDatePicker = forwardRef(function MUIStaticDatePicker(
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
  }: MUIStaticDatePickerProps,
  ref: Ref<HTMLDivElement>
) {
  const { dateAdapter, allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  if (!dateAdapter) {
    throw new Error(generateDateAdapterErrMsg('MUIStaticDatePicker'));
  }

  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );

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
        <div
          id={fieldId}
          role="group"
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
        >
          <MuiStaticDatePicker
            {...otherPickerProps}
            ref={ref}
            value={muiValue ?? null}
            disabled={muiDisabled}
            onChange={(newValue, context) => {
              onValueChange({ newValue, context });
            }}
            onAccept={(newValue, context) => {
              muiOnAccept?.(newValue, context);
            }}
            slotProps={muiSlotProps}
          />
        </div>
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

export default MUIStaticDatePicker;
