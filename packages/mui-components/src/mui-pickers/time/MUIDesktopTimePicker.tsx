'use client';

import {
  useContext,
  forwardRef,
  type Ref,
  type ReactNode
} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DesktopTimePicker as MuiDesktopTimePicker,
  type DesktopTimePickerProps,
  type PickerValidDate,
  type TimeValidationError,
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
  useFieldIds
} from '@/utils';

type DesktopTimePickerInputProps = Omit<
  DesktopTimePickerProps,
  'name' | 'defaultValue' | 'inputRef' | 'onChange'
>;

type PickerOnValueChangeProps<ValidationError> = {
  newValue: PickerValidDate | null;
  context: PickerChangeHandlerContext<ValidationError>;
};

export type MUIDesktopTimePickerProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Called after the default handler accepts a valid time value.
   *
   * @param newValue - New time value emitted by MUI X.
   * @param context - MUI X picker change context, including validation status.
   */
  onValueChange: ({
    newValue,
    context
  }: PickerOnValueChangeProps<TimeValidationError>) => void;
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
   * Error message for the field. Any non-empty string puts the field into an error state.
   */
  errorMessage?: string | null;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string.
   */
  renderError?: (error: string) => ReactNode;
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
} & DesktopTimePickerInputProps;

const MUIDesktopTimePicker = forwardRef(function MUIDesktopTimePicker(
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
  }: MUIDesktopTimePickerProps,
  ref: Ref<HTMLInputElement>
) {
  const { dateAdapter, allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  if (!dateAdapter) {
    throw new Error(generateDateAdapterErrMsg('MUIDesktopTimePicker'));
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
  const isError = !!errorMessage;
  const fieldErrorMessage = isError
    ? renderError?.(errorMessage) ?? errorMessage
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
        <MuiDesktopTimePicker
          {...otherPickerProps}
          name={fieldName}
          inputRef={ref}
          value={muiValue ?? null}
          disabled={muiDisabled}
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

export default MUIDesktopTimePicker;
