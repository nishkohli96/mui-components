'use client';

import {
  Fragment,
  useContext,
  type ReactNode
} from 'react';
import MuiSlider, { type SliderProps } from '@mui/material/Slider';
import {
  FormLabel,
  FormHelperText,
  type FormLabelProps,
  type FormHelperTextProps
} from '@/common';
import { RHFMuiConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  resolveLabelAboveControl,
  useFieldIds
} from '@/utils';

type SliderInputProps = Omit<
  SliderProps,
  | 'name'
  | 'value'
  | 'onChange'
>;

type OnValueChangeProps = {
  newValue: number | number[];
  activeThumb: number;
  event: Event;
};

export type MUISliderProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current slider value. Pass a number array for range sliders. This is a controlled
   * component: `value` and `onValueChange` must be supplied together, typically backed
   * by your own state or form library.
   *
   * `undefined`/`null`/`[]` are treated as `0`.
   */
  value?: number | number[] | null;
  /**
   * Called on every slide with the next value, the active thumb index, and the
   * original change event. Call your state setter (or form library's setter)
   * with `newValue` to update `value`.
   *
   * @param newValue - Next slider value, or value array for range sliders.
   * @param activeThumb - Index of the thumb that changed for range sliders.
   * @param event - Original slider change event.
   */
  onValueChange: ({
    newValue,
    activeThumb,
    event
  }: OnValueChangeProps) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * Whether the field label renders above the slider. The slider has no built-in
   * inline label, so this defaults to `true`; pass `false` to hide the visible
   * label (the accessible name is still applied).
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
   * Custom renderer for `errorMessage`. Receives the raw error string and must return
   * renderable content, e.g. wrapping it with an icon or a styled element.
   *
   * @param error - Current `errorMessage` for this slider.
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
} & SliderInputProps;

const MUISlider = ({
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
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  onBlur,
  customIds,
  ...otherSliderProps
}: MUISliderProps) => {
  const { allLabelsAboveFields } = useContext(RHFMuiConfigContext);
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

  const sliderValue = value ?? 0;
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
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveControl}
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId
          }}
        />
      )}
      <MuiSlider
        {...otherSliderProps}
        id={fieldId}
        name={fieldName}
        value={sliderValue}
        disabled={muiDisabled}
        onChange={(event, newValue, activeThumb) => {
          onValueChange({ newValue, activeThumb, event });
        }}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-labelledby={
          !hideLabel && isLabelAboveControl ? labelId : undefined
        }
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-valuetext={
          Array.isArray(sliderValue)
            ? sliderValue.join(' to ')
            : String(sliderValue)
        }
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
    </Fragment>
  );
};

export default MUISlider;
