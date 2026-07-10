'use client';

import {
  useContext,
  Fragment,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { type SwitchProps } from '@mui/material/Switch';
import {
  FormHelperText,
  type FormControlLabelProps,
  type FormHelperTextProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import { fieldNameToLabel, useFieldIds, parseErrorInput, type FieldErrorInput } from '@/utils';

type OnValueChangeProps = {
  newValue: boolean;
  event: ChangeEvent<HTMLInputElement>;
};

export type MUISwitchProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current checked state. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`false` are treated as off.
   */
  value?: boolean;
  /**
   * Called on every toggle with the next checked state and the original change event.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Next checked state.
   * @param event - Original switch change event.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
  /**
   * Label content shown beside the switch. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Props forwarded to the switch `FormControlLabel`.
   */
  formControlLabelProps?: FormControlLabelProps;
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
} & Omit<SwitchProps, 'name' | 'value' | 'checked' | 'defaultChecked' | 'onChange'>;

const MUISwitch = ({
  fieldName,
  value,
  onValueChange,
  disabled: muiDisabled,
  label,
  formControlLabelProps,
  hideLabel,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  onBlur,
  slotProps: muiSlotProps,
  customIds,
  ...otherSwitchProps
}: MUISwitchProps) => {
  const {
    fieldId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const { defaultFormControlLabelSx } = useContext(MUIComponentsConfigContext);
  const { sx, ...otherFormControlLabelProps } = formControlLabelProps ?? {};
  const appliedFormControlLabelSx = {
    ...defaultFormControlLabelSx,
    ...sx,
  };

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
    <Fragment>
      <FormControlLabel
        {...otherFormControlLabelProps}
        control={
          <Switch
            {...otherSwitchProps}
            id={fieldId}
            name={fieldName}
            checked={Boolean(value)}
            disabled={muiDisabled}
            onChange={(event, isChecked) => {
              onValueChange({ newValue: isChecked, event });
            }}
            onBlur={onBlur}
            aria-label={hideLabel ? accessibleFieldLabel : undefined}
            aria-describedby={
              showHelperTextElement
                ? isError
                  ? errorId
                  : helperTextId
                : undefined
            }
            aria-invalid={isError || undefined}
            slotProps={muiSlotProps}
          />
        }
        label={hideLabel ? undefined : fieldLabel}
        sx={appliedFormControlLabelSx}
        disabled={muiDisabled}
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
    </Fragment>
  );
};

export default MUISwitch;
