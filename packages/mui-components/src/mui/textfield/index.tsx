'use client';

import { useContext, type ReactNode, type ChangeEvent } from 'react';
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
import { RHFMuiConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import { fieldNameToId, fieldNameToLabel, keepLabelAboveFormField, useFieldIds } from '@/utils';

type OnValueChangeProps = {
  newValue: string;
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
};

export type MUITextFieldProps = {
  /**
   * Name/path of the React Hook Form field this component controls.
   */
  fieldName: string;
  /**
   * Called after the default text field handler stores the next string in React Hook Form.
   *
   * @param newValue - Next input string.
   * @param event - Original input change event.
   */
  onValueChange?: ({ newValue, event }: OnValueChangeProps) => void;
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
   * Field error message is now automatically derived from form state.
   * Passing this prop is no longer necessary and it will be removed in the next major version.
   *
   * Use `renderError` to customize how the field error is rendered.
   */
  errorMessage?: ReactNode;
  /**
   * Custom renderer for the React Hook Form field error.
   * Receives the current field error and must return renderable content, such as `error.message` or a custom element.
   *
   * @param error - React Hook Form field error for this text field.
   */
  renderError?: (error: ReactNode) => ReactNode;
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
} & TextFieldProps;

const MUITextField = ({
  fieldName,
  value,
  onValueChange,
  disabled: muiDisabled,
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
  onBlur: muiOnBlur,
  autoComplete = defaultAutocompleteValue,
  slotProps: muiSlotProps,
  ref: muiRef,
  customIds,
  ...otherTextFieldProps
}: MUITextFieldProps) => {
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(fieldName, customIds);
  const { allLabelsAboveFields } = useContext(RHFMuiConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(showLabelAboveFormField, allLabelsAboveFields);

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string' ? fieldLabel : defaultFieldLabel;

  const fieldErrorMessage = renderError?.(errorMessage) ?? errorMessage;
  const isError = !!errorMessage;
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
        {...otherTextFieldProps}
        id={fieldId}
        name={fieldNameToId(fieldName)}
        inputRef={muiRef}
        autoComplete={autoComplete}
        label={
          !hideLabel && !isLabelAboveFormField ? <FormLabelText label={fieldLabel} required={required} /> : undefined
        }
        value={value}
        disabled={muiDisabled}
        onChange={event => {
          const newValue = event.target.value;
          onValueChange?.({ newValue, event });
        }}
        onBlur={blurEvent => {
          muiOnBlur?.(blurEvent);
        }}
        error={isError}
        slotProps={{
          ...muiSlotProps,
          htmlInput: {
            ...muiSlotProps?.htmlInput,
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

export default MUITextField;
