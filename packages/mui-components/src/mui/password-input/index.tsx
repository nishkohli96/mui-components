'use client';

import {
  useContext,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
  type ReactNode
} from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
import { fieldNameToLabel, keepLabelAboveFormField, useFieldIds } from '@/utils';

type OnValueChangeProps = {
  newValue: string;
  event: ChangeEvent<HTMLInputElement>;
};

type InputPasswordProps = Omit<
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

export type MUIPasswordInputProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current value of the field. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`null` are treated as an empty string.
   */
  value?: string | null;
  /**
   * Called on every input change with the next string value and the original change event.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Next password string.
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
   * Custom icon displayed when the password is currently hidden.
   *
   * Clicking this icon reveals the password value.
   *
   * @default Visibility icon
   */
  showPasswordIcon?: ReactNode;
  /**
   * Custom icon displayed when the password is currently visible.
   *
   * Clicking this icon hides the password value.
   *
   * @default VisibilityOff icon
   */
  hidePasswordIcon?: ReactNode;
  /**
   * Error message for the field. Any non-empty string puts the field into an error state
   * (shown via `FormControl`/`TextField` `error` and surfaced through `FormHelperText`).
   * Pass `undefined` or `null` to clear the error state.
   *
   * Use `renderError` to customize how this message is rendered.
   */
  errorMessage?: string | null;
  /**
   * Forces the field's error state regardless of `errorMessage` — useful when a
   * form library reports an error without a message string. When omitted, the
   * error state is derived from `errorMessage`.
   */
  error?: boolean;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string and must return
   * renderable content, e.g. wrapping it with an icon or a styled element.
   *
   * @param error - Current `errorMessage` for this password input.
   */
  renderError?: (error: string) => ReactNode;
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
} & InputPasswordProps;

const MUIPasswordInput = ({
  fieldName,
  value: muiValue,
  onValueChange,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  showPasswordIcon,
  hidePasswordIcon,
  required,
  errorMessage,
  error,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  slotProps: muiSlotProps,
  onBlur: muiOnBlur,
  autoComplete = defaultAutocompleteValue,
  customIds,
  ...otherPasswordInputProps
}: MUIPasswordInputProps) => {
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(fieldName, customIds);
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(showLabelAboveFormField, allLabelsAboveFields);

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string' ? fieldLabel : defaultFieldLabel;

  const [showPassword, setShowPassword] = useState(false);
  const ShowPasswordIcon = showPasswordIcon ?? <VisibilityIcon />;
  const HidePasswordIcon = hidePasswordIcon ?? <VisibilityOffIcon />;

  const isError = error ?? !!errorMessage;
  const fieldErrorMessage = errorMessage
    ? renderError?.(errorMessage) ?? errorMessage
    : undefined;
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        type="button"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {showPassword ? HidePasswordIcon : ShowPasswordIcon}
      </IconButton>
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
      <TextField
        {...otherPasswordInputProps}
        id={fieldId}
        name={fieldName}
        autoComplete={autoComplete}
        type={showPassword ? 'text' : 'password'}
        label={
          !hideLabel && !isLabelAboveFormField
            ? <FormLabelText label={fieldLabel} required={required} />
            : undefined
        }
        value={muiValue ?? ''}
        disabled={muiDisabled}
        onChange={event => {
          const changeEvent = event as ChangeEvent<HTMLInputElement>;
          const newValue = changeEvent.target.value;
          onValueChange({ newValue, event: changeEvent });
        }}
        onBlur={blurEvent => {
          muiOnBlur?.(blurEvent as FocusEvent<HTMLInputElement>);
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
          },
          input: {
            ...muiSlotProps?.input,
            endAdornment: (
              <>
                {(muiSlotProps?.input as { endAdornment?: ReactNode })?.endAdornment}
                {endAdornment}
              </>
            )
          }
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

export default MUIPasswordInput;
