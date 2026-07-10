'use client';

import {
  useContext,
  Fragment,
  type ReactNode
} from 'react';
import {
  ColorPicker as ReactColorPicker,
  Saturation,
  Hue,
  useColor,
  type IColor
} from 'react-color-palette';
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
  colorToString,
  useFieldIds,
  resolveLabelAboveControl,
  parseErrorInput,
  type FieldErrorInput
} from '@/utils';
import 'react-color-palette/css';

type ColorFormat = keyof IColor;

type MUIColorPickerOnChangeProps = {
  color: IColor;
  colorValue: string;
  setColor: (newColor: IColor) => void;
};

export type MUIColorPickerProps = {
  /**
   * Name/path of the field. Used to derive generated ids and the default label.
   */
  fieldName: string;
  /**
   * Current color value. When empty, `defaultColor` is used as the picker state.
   */
  value?: string | null;
  /**
   * Called with the formatted color value and raw `IColor` object whenever the picker changes.
   */
  onValueChange: ({ color, colorValue, setColor }: MUIColorPickerOnChangeProps) => void;
  /**
   * Color format emitted through `onValueChange`.
   *
   * `hex` emits the color hex string. Other formats are converted to a CSS color string.
   * @default 'hex'
   */
  valueKey?: ColorFormat;
  /**
   * Initial color used by the picker when `value` is empty.
   * @default '#000000'
   */
  defaultColor?: string;
  /**
   * When true, omits alpha from emitted color values.
   */
  excludeAlpha?: boolean;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Height, in pixels, of the color picker control.
   * @default 200
   */
  height?: number;
  /**
   * When true, hides alpha controls in the color picker.
   */
  hideAlpha?: boolean;
  /**
   * Hides picker input fields rendered by `react-color-palette`.
   */
  hideInput?: (keyof IColor)[] | boolean;
  /**
   * When true, disables the field and associated controls.
   */
  disabled?: boolean;
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
   * message(s) are surfaced through `FormHelperText`. Pass `true` to force the
   * error state without a message; `undefined`/`null`/`false`/`''`/`[]` clear it.
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
   * Custom ids for generated label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

const MUIColorPicker = ({
  fieldName,
  value,
  onValueChange,
  valueKey = 'hex',
  defaultColor = '#000000',
  excludeAlpha,
  required,
  hideInput,
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
  height = 200,
  customIds,
  hideAlpha,
}: MUIColorPickerProps) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const {
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const [color, setColor] = useColor(value ?? defaultColor);
  const renderHSLView = valueKey === 'hsv';

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const isLabelAboveControl = resolveLabelAboveControl(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

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

  const getFormattedColor = (color: IColor) =>
    valueKey === 'hex'
      ? color.hex
      : colorToString(color[valueKey], excludeAlpha);

  const wrappedSetColor = (newColor: IColor) => {
    setColor(newColor);
  };

  const handleColorChange = (newColor: IColor) => {
    onValueChange({
      color: newColor,
      colorValue: getFormattedColor(newColor),
      setColor: wrappedSetColor
    });
  };

  return (
    <FormControl
      component="fieldset"
      error={isError}
      disabled={muiDisabled}
      aria-labelledby={!hideLabel && isLabelAboveControl ? labelId : undefined}
      aria-label={
        hideLabel || !isLabelAboveControl
          ? accessibleFieldLabel
          : undefined
      }
      aria-describedby={
        showHelperTextElement
          ? isError
            ? errorId
            : helperTextId
          : undefined
      }
    >
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          required={required}
          error={isError}
          isVisible={isLabelAboveControl}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            component: 'legend'
          }}
        />
      )}
      {renderHSLView
        ? (
          <Fragment>
            <Saturation
              height={height}
              color={color}
              disabled={muiDisabled}
              onChange={handleColorChange}
            />
            <Hue
              color={color}
              disabled={muiDisabled}
              onChange={handleColorChange}
            />
          </Fragment>
        )
        : (
          <ReactColorPicker
            color={color}
            disabled={muiDisabled}
            onChange={handleColorChange}
            height={height}
            hideInput={muiDisabled ? true : hideInput}
            hideAlpha={hideAlpha}
          />
        )}
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

export default MUIColorPicker;


