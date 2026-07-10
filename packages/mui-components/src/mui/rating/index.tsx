'use client';

import {
  useContext,
  type ReactNode,
  type SyntheticEvent
} from 'react';
import MuiRating, { type RatingProps } from '@mui/material/Rating';
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
  resolveLabelAboveControl,
  useFieldIds
} from '@/utils';

type OnValueChangeProps = {
  newValue: number | null;
  event: SyntheticEvent<Element, Event>;
};

type InputRatingProps = Omit<
  RatingProps,
  | 'name'
  | 'onChange'
  | 'error'
  | 'value'
  | 'defaultValue'
>;

export type MUIRatingProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current rating value. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`null` are treated as no rating selected.
   */
  value?: number | null;
  /**
   * Called on every rating change with the next value and the original change event.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Next rating value, or `null` when cleared.
   * @param event - Original rating change event.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Whether the field label renders above the rating control. The rating has no
   * built-in inline label, so this defaults to `true`; pass `false` to hide the
   * visible label (the accessible name is still applied).
   *
   * @default true
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
   * Error message for the field. Any non-empty string puts the field into an error state
   * (surfaced through `FormHelperText`). Pass `undefined` or `null` to clear the error state.
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
   * @param error - Current `errorMessage` for this rating.
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
} & InputRatingProps;

const MUIRating = ({
  fieldName,
  value,
  onValueChange,
  required,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  errorMessage,
  error,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  onBlur,
  customIds,
  ...otherRatingProps
}: MUIRatingProps) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const {
    fieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const isLabelAboveControl = resolveLabelAboveControl(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

  const isError = error ?? !!errorMessage;
  const fieldErrorMessage = errorMessage
    ? renderError?.(errorMessage) ?? errorMessage
    : undefined;
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  return (
    <FormControl
      component="fieldset"
      error={isError}
      disabled={muiDisabled}
    >
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveControl}
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            component: 'legend'
          }}
        />
      )}
      <MuiRating
        {...otherRatingProps}
        id={fieldId}
        name={fieldName}
        value={value ?? null}
        disabled={muiDisabled}
        onChange={(event, newValue) => {
          onValueChange({ newValue, event });
        }}
        onBlur={onBlur}
        aria-labelledby={!hideLabel ? labelId : undefined}
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
        aria-invalid={isError || undefined}
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

export default MUIRating;
