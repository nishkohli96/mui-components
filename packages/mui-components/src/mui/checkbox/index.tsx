'use client';

import {
  useContext,
  Fragment,
  type ReactNode,
  type ChangeEvent
} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import {
  FormHelperText,
  type FormControlLabelProps,
  type FormHelperTextProps,
  type CheckboxProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import { fieldNameToLabel, useFieldIds } from '@/utils';

type OnValueChangeProps = {
  newValue: boolean;
  event: ChangeEvent<HTMLInputElement>;
};

export type MUICheckboxProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current checked state. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`false` are treated as unchecked.
   */
  value?: boolean;
  /**
   * Called on every toggle with the next checked state and the original change event.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Next checked state.
   * @param event - Original checkbox change event.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
  /**
   * Label content shown beside the checkbox. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Props forwarded to the checkbox `FormControlLabel`.
   */
  formControlLabelProps?: FormControlLabelProps;
  /**
   * When true, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * Error message for the field. Any non-empty string puts the field into an error state
   * (surfaced through `FormHelperText`). Pass `undefined` or `null` to clear the error state.
   *
   * Use `renderError` to customize how this message is rendered.
   */
  errorMessage?: string | null;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string and must return
   * renderable content, e.g. wrapping it with an icon or a styled element.
   *
   * @param error - Current `errorMessage` for this checkbox.
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
} & CheckboxProps;

const MUICheckbox = ({
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
  ...otherCheckboxProps
}: MUICheckboxProps) => {
  const { fieldId, helperTextId, errorId } = useFieldIds(fieldName, customIds);

  const { defaultFormControlLabelSx } = useContext(MUIComponentsConfigContext);
  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;

  const { sx, ...otherFormControlLabelProps } = formControlLabelProps ?? {};
  const appliedFormControlLabelSx = {
    ...defaultFormControlLabelSx,
    ...sx
  };

  const isError = !!errorMessage;
  const fieldErrorMessage = isError
    ? renderError?.(errorMessage) ?? errorMessage
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
          <MuiCheckbox
            {...otherCheckboxProps}
            id={fieldId}
            name={fieldName}
            checked={Boolean(value)}
            disabled={muiDisabled}
            onChange={(event, checked) => {
              onValueChange({ newValue: checked, event });
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

export default MUICheckbox;
