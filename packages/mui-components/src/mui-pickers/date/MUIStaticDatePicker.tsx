'use client';

import { useContext, type ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  StaticDatePicker as MuiStaticDatePicker,
  type StaticDatePickerProps,
  type DateValidationError,
  type PickerChangeHandlerContext,
  type PickerValidDate
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
  getErrorList
} from '@/utils';

type StaticDatePickerInputProps = Omit<
  StaticDatePickerProps,
  'onChange' | 'value'
>;

type PickerOnValueChangeProps<TDate extends PickerValidDate, ValidationError> = {
  newValue: TDate | null;
  context: PickerChangeHandlerContext<ValidationError>;
};

export type MUIStaticDatePickerProps<TDate extends PickerValidDate = PickerValidDate> = {
  /**
   * Name/path of the field. Used to derive generated ids and the default label.
   */
  fieldName: string;
  /**
   * Current picker value, in the date type of your configured `dateAdapter`
   * (e.g. `Dayjs`, `Moment`, `DateTime`, native `Date`). This is a controlled
   * component: `value` and `onValueChange` must be supplied together.
   * Pass `null` or `undefined` to clear the picker.
   *
   * `TDate` is inferred from the `value` you pass, so `newValue` on
   * `onValueChange` comes back precisely typed instead of MUI X's
   * adapter-agnostic `PickerValidDate`.
   */
  value?: TDate | null;
  /**
   * Called after the default handler accepts a valid date value.
   */
  onValueChange: ({
    newValue,
    context
  }: PickerOnValueChangeProps<TDate, DateValidationError>) => void;
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
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & StaticDatePickerInputProps;

const MUIStaticDatePicker = <TDate extends PickerValidDate = PickerValidDate>({
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
}: MUIStaticDatePickerProps<TDate>) => {
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
            value={muiValue ?? null}
            disabled={muiDisabled}
            onChange={(newValue, context) => {
              /*
               * MUI X reports newValue as its adapter-agnostic `PickerValidDate`;
               * narrow it back to `TDate` (the type `value` was given as) here,
               * once, so `onValueChange` receives a precisely-typed value.
               */
              onValueChange({ newValue: newValue as TDate | null, context });
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
};

export default MUIStaticDatePicker;
