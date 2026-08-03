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
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  resolveLabelAboveControl,
  useFieldIds,
  getErrorList
} from '@/utils';

type SliderInputProps = Omit<
  SliderProps,
  | 'name'
  | 'value'
  | 'onChange'
>;

type SliderValue = number | number[];

/*
 * MUI types onChange's value as the wide `number | number[]` union;
 * narrow it back to `Value` (a single-thumb slider always emits a
 * number, a range slider an array, matching the `value` shape).
 */
type OnValueChangeProps<Value extends SliderValue> = {
  newValue: Value;
  activeThumb: number;
  event: Event;
};

export type MUISliderProps<Value extends SliderValue = SliderValue> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current slider value: a `number` for a single-thumb slider, or a `number[]`
   * for a range slider. This is a controlled component: `value` and
   * `onValueChange` must be supplied together, typically backed by your own state
   * or form library.
   *
   * `undefined`/`null`/`[]` are treated as `0`.
   */
  value?: Value | null;
  /**
   * Called on every slide with the next value, the active thumb index, and the
   * original change event. Call your state setter (or form library's setter)
   * with `newValue` to update `value`.
   *
   * `newValue` mirrors `value`: a `number` when `value` is a number, or a
   * `number[]` when `value` is an array — so a single-value slider gives `number`
   * and a range slider gives `number[]`, no cast needed.
   *
   * @param newValue - Next slider value, or value array for range sliders.
   * @param activeThumb - Index of the thumb that changed for range sliders.
   * @param event - Original slider change event.
   */
  onValueChange: ({
    newValue,
    activeThumb,
    event
  }: OnValueChangeProps<Value>) => void;
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
} & SliderInputProps;

const MUISlider = <Value extends SliderValue = SliderValue>({
  fieldName,
  value,
  onValueChange,
  onBlur: muiOnBlur,
  disabled: muiDisabled,
  required,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  customIds,
  ...otherSliderProps
}: MUISliderProps<Value>) => {
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

  const sliderValue = value ?? 0;
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
          onValueChange({
            newValue: newValue as Value,
            activeThumb,
            event
          });
        }}
        onBlur={muiOnBlur}
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
