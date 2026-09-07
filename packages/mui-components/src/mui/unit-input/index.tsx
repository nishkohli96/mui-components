'use client';

import { useContext, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { ResponsiveStyleValue } from '@mui/system';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type OptionValue
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds, StrObjOption } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  useFieldIds,
  getErrorList,
  getOptionValue
} from '@/utils';
import MUINumberInput, { type MUINumberInputProps } from '../number-input';
import MUISelect, { type MUISelectProps } from '../select';

/** Minimum width for both the quantity input and the unit `Select`, so
 * neither collapses to an unusable size when `unitWidth` skews the split. */
const MIN_SEGMENT_WIDTH = 50;

export type MUIUnitInputValue<Unit extends string = string> = {
  /** Numeric quantity. `null` renders an empty input. */
  quantity: number | null;
  /** Currently selected unit — one of the values passed via `unitOptions`. */
  unit: Unit;
};

type OnValueChangeProps<Unit extends string> = {
  newValue: MUIUnitInputValue<Unit>;
  event: Parameters<MUINumberInputProps['onValueChange']>[0]['event']
    | Parameters<MUISelectProps<StrObjOption>['onValueChange']>[0]['event'];
};

type QuantityInputProps = Omit<
  MUINumberInputProps,
  | 'fieldName'
  | 'value'
  | 'onValueChange'
  | 'showMarkers'
  | 'variant'
  | 'label'
  | 'showLabelAboveFormField'
  | 'formLabelProps'
  | 'hideLabel'
  | 'errorMessage'
  | 'renderError'
  | 'hideErrorMessage'
  | 'helperText'
  | 'formHelperTextProps'
  | 'customIds'
  | 'required'
  | 'disabled'
  | 'placeholder'
  | 'onlyIntegers'
  | 'nonNegative'
  | 'maxDecimalPlaces'
  | 'min'
  | 'max'
>;

type UnitSelectProps<
  Option extends StrObjOption,
  LabelKey extends Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string>
> = Omit<
  MUISelectProps<Option, LabelKey, ValueKey>,
  | 'fieldName'
  | 'options'
  | 'labelKey'
  | 'valueKey'
  | 'value'
  | 'onValueChange'
  | 'variant'
  | 'label'
  | 'showLabelAboveFormField'
  | 'formLabelProps'
  | 'hideLabel'
  | 'errorMessage'
  | 'renderError'
  | 'hideErrorMessage'
  | 'helperText'
  | 'formHelperTextProps'
  | 'customIds'
  | 'required'
  | 'disabled'
>;

export type MUIUnitInputProps<
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  Unit extends string = OptionValue<Option, ValueKey> & string
> = {
  /**
   * Name/path of the field's two underlying controls, kept separate (rather
   * than one combined `fieldName`) so each can be registered independently
   * against a flat form schema — e.g. `{ quantity: 'weight', unit: 'weightUnit' }`.
   */
  fieldName: {
    quantity: string;
    unit: string;
  };
  /**
   * Current value of the field. `quantity` and `unit` are always reported
   * together through `onValueChange`, even though they're two controls.
   */
  value?: MUIUnitInputValue<Unit>;
  /**
   * Called whenever either the quantity or the unit changes. Always receives
   * the full `{ quantity, unit }` value — read `newValue.quantity` /
   * `newValue.unit` as needed.
   */
  onValueChange: ({ newValue, event }: OnValueChangeProps<Unit>) => void;
  /**
   * Units selectable from the dropdown — a plain string array (e.g.
   * `['USD', 'EUR', 'GBP']`, or a string-literal union/enum's values for
   * literal-union safety on `value.unit`/`newValue.unit`), or an object
   * array read via `labelKey`/`valueKey`, same convention as `MUISelect`.
   * The resolved unit value is always a `string` — a numeric or nullable
   * unit belongs in a second `MUINumberInput`, not here.
   */
  unitOptions: Option[];
  /**
   * Object key used to read the display label from each option, when
   * `unitOptions` is an array of objects.
   */
  labelKey?: LabelKey;
  /**
   * Object key used to derive the unit value from each option, when
   * `unitOptions` is an array of objects.
   */
  valueKey?: ValueKey;
  /**
   * Which side the unit `Select` renders on relative to the quantity input.
   * @default 'end'
   */
  unitPosition?: 'start' | 'end';
  /**
   * Width of the unit `Select` as a CSS `flex-basis` value — typically a
   * percentage (e.g. `'30%'`), so the quantity input (`flex: 1`) fills the
   * rest. Accepts a single value or a responsive `sx`-style breakpoint object
   * (e.g. `{ xs: '40%', md: '30%' }`). When omitted, the unit `Select` sizes
   * to its content instead of a fixed share of the pill.
   */
  unitWidth?: ResponsiveStyleValue<string>;
  /**
   * Placeholder shown in the empty quantity input.
   */
  placeholder?: string;
  /**
   * When `true`, only integer quantities are allowed. Cannot be used
   * together with `maxDecimalPlaces`.
   */
  onlyIntegers?: MUINumberInputProps['onlyIntegers'];
  /**
   * When `true`, negative quantities are not allowed. Acts as an implicit
   * `min` of `0`.
   */
  nonNegative?: MUINumberInputProps['nonNegative'];
  /**
   * Maximum number of decimal places allowed in the quantity. Cannot be used
   * together with `onlyIntegers`.
   */
  maxDecimalPlaces?: MUINumberInputProps['maxDecimalPlaces'];
  /** Lower bound for the quantity. */
  min?: MUINumberInputProps['min'];
  /** Upper bound for the quantity. */
  max?: MUINumberInputProps['max'];
  /**
   * When true, renders the field label above the form field instead of inside or beside it.
   */
  showLabelAboveFormField?: boolean;
  /**
   * Custom field label. Defaults to a humanized version of `fieldName.quantity`.
   */
  label?: ReactNode;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: MUINumberInputProps['formLabelProps'];
  /**
   * When true, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * When true, marks both the quantity and unit controls as required.
   */
  required?: boolean;
  /**
   * When true, disables both the quantity and unit controls.
   */
  disabled?: boolean;
  /**
   * Validation error for the field — pass a single message `string`, or a
   * `string[]` when the field can fail multiple rules at once.
   */
  errorMessage?: string | string[];
  /**
   * Custom renderer for the resolved error message(s).
   */
  renderError?: (errors: string[]) => ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Helper text shown below the field when there's no error.
   */
  helperText?: ReactNode;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: MUINumberInputProps['formHelperTextProps'];
  /**
   * Custom ids for the quantity and unit controls respectively.
   */
  customIds?: {
    quantity?: CustomComponentIds;
    unit?: CustomComponentIds;
  };
  /**
   * Props forwarded to the internal quantity `MUINumberInput`.
   */
  quantityInputProps?: QuantityInputProps;
  /**
   * Props forwarded to the internal unit `MUISelect`.
   */
  unitSelectProps?: UnitSelectProps<Option, LabelKey, ValueKey>;
  /** Props forwarded to the outer pill container. */
  sx?: MUINumberInputProps['sx'];
};

/**
 * A pill-shaped `MUINumberInput` + `MUISelect` combo — a numeric quantity
 * paired with a unit picker (currency, weight, temperature, anything),
 * rendered borderless inside one bordered pill and divided by a single
 * border, similar in spirit to `MUIPhoneInput`'s country + number pairing.
 *
 * `unitOptions` accepts either a plain string array or an array of objects read
 * via `labelKey`/`valueKey`, same convention as `MUISelect`; the resolved
 * unit value is always a `string`.
 *
 * `fieldName`/`customIds` take one entry per control (`quantity`/`unit`) so
 * each can be registered independently against a flat form schema; `value`/
 * `onValueChange` still report the pair together as one `{ quantity, unit }`
 * object.
 *
 * Docs: [MUIUnitInput](https://mui-components-docs.vercel.app/v1/components/mui/unit-input)
 *
 * API: [MUIUnitInputProps](https://mui-components-docs.vercel.app/v1/components/mui/unit-input#api)
 */
const MUIUnitInput = <
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  Unit extends string = OptionValue<Option, ValueKey> & string
>({
  fieldName,
  value,
  onValueChange,
  unitOptions,
  labelKey,
  valueKey,
  unitPosition = 'end',
  unitWidth,
  placeholder,
  onlyIntegers,
  nonNegative,
  maxDecimalPlaces,
  min,
  max,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  required,
  disabled,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  customIds,
  quantityInputProps,
  unitSelectProps,
  sx: muiSx
}: MUIUnitInputProps<Option, LabelKey, ValueKey, Unit>) => {
  const {
    fieldId: quantityFieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName.quantity, customIds?.quantity);

  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const fieldLabel = label ?? fieldNameToLabel(fieldName.quantity);

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
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  const resolvedUnit = value?.unit
    ?? (getOptionValue(unitOptions[0], valueKey) as unknown as Unit);

  /*
   * `MUINumberInput`/`MUISelect` each wrap themselves in the shared
   * `FormControl` (`fullWidth` by default) and never forward `sx` to that
   * outer wrapper — only to their own inner control. Sizing sx passed
   * directly to either component would therefore be ignored by the actual
   * flex item (the outer `fullWidth` `FormControl`), so the flex/minWidth
   * layout lives on these wrapping `Box`es instead, leaving each
   * component's own `sx` free for its internal styling only.
   */
  const quantityInput = (
    <Box sx={{ flex: '1 1 auto', minWidth: MIN_SEGMENT_WIDTH }}>
    <MUINumberInput
      {...quantityInputProps}
      fieldName={fieldName.quantity}
      value={value?.quantity ?? null}
      onValueChange={({ newValue, event }) => {
        onValueChange({
          newValue: { quantity: newValue, unit: resolvedUnit },
          event
        });
      }}
      placeholder={placeholder}
      onlyIntegers={onlyIntegers}
      nonNegative={nonNegative}
      maxDecimalPlaces={maxDecimalPlaces}
      min={min}
      max={max}
      disabled={disabled}
      required={required}
      customIds={customIds?.quantity}
      hideLabel
      hideErrorMessage
      variant="standard"
      slotProps={{
        ...quantityInputProps?.slotProps,
        input: ownerState => {
          const externalInputProps = typeof quantityInputProps?.slotProps?.input === 'function'
            ? quantityInputProps.slotProps.input(ownerState)
            : quantityInputProps?.slotProps?.input;
          return {
            ...externalInputProps,
            disableUnderline: true
          };
        }
      }}
    />
    </Box>
  );

  const unitSelect = (
    <Box
      sx={{
        /**
         * Never grow to absorb extra leftover space in the row.
         */
        flexGrow: 0,
        /**
         * Whether it's allowed to shrink below that basis if the
         * row runs out of room. 0: No, 1: Yes.
         */
        flexShrink: unitWidth !== undefined ? 0 : 1,
        /**
         * When you pass unitWidth (e.g. '30%'), that's its size.
         * When you don't, 'auto' means "size to content"
         */
        flexBasis: unitWidth ?? 'auto',
        minWidth: MIN_SEGMENT_WIDTH
      }}
    >
    <MUISelect<Option, LabelKey, ValueKey>
      {...unitSelectProps}
      fieldName={fieldName.unit}
      options={unitOptions}
      labelKey={labelKey}
      valueKey={valueKey}
      value={resolvedUnit as unknown as OptionValue<Option, ValueKey>}
      onValueChange={({ newValue, event }) => {
        onValueChange({
          newValue: { quantity: value?.quantity ?? null, unit: newValue as unknown as Unit },
          event
        });
      }}
      disabled={disabled}
      required={required}
      customIds={customIds?.unit}
      hideLabel
      hideErrorMessage
      variant="standard"
      sx={{
        '&:before, &:after': { display: 'none' },
        ...unitSelectProps?.sx
      }}
    />
    </Box>
  );

  const divider = (
    <Box
      sx={{
        borderLeft: '1px solid',
        borderColor: 'divider'
      }}
    />
  );

  return (
    <FormControl error={isError} disabled={disabled}>
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveFormField}
          required={required}
          error={isError}
          disabled={disabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            htmlFor: quantityFieldId
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          border: '1px solid',
          borderColor: isError ? 'error.main' : 'divider',
          borderRadius: '8px',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          px: 2,
          gap: 1.5,
          '&:focus-within': {
            borderColor: isError ? 'error.main' : 'primary.main',
            borderWidth: '2px',
            m: '-1px'
          },
          ...muiSx
        }}
      >
        {unitPosition === 'start' && unitSelect}
        {unitPosition === 'start' && divider}
        {quantityInput}
        {unitPosition === 'end' && divider}
        {unitPosition === 'end' && unitSelect}
      </Box>
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

export default MUIUnitInput;
