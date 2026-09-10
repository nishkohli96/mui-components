'use client';

import { useContext, type ReactNode } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
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
  generateUnitInputFieldNameErrMsg,
  useFieldIds,
  getErrorList,
  getOptionValue,
  mergeSx,
} from '@/utils';
import MUINumberInput, { type MUINumberInputProps } from '../number-input';
import MUISelect, { type MUISelectProps, type SelectValue } from '../select';

/**
 * Minimum width for both the "**value**" input and the "**unit**" `Select`,
 * so neither collapses to an unusable size when `unitWidth` skews the split.
 */
const MIN_SEGMENT_WIDTH = 50;

/**
 * The unit value type `MUIUnitInput` reports through `value`/
 * `onValueChange` — computed the same way `MUISelect` computes its own value
 * type (`SelectValue<OptionValue<Option, ValueKey>, Multiple>`, `Multiple`
 * always `false` here) rather than hand-defined.
 */
type ResolvedUnit<
  Option extends StrObjOption,
  ValueKey extends Extract<keyof Option, string>
> = SelectValue<OptionValue<Option, ValueKey>, false> & string;

export type MUIUnitInputValue<Unit extends string = string> = {
  /** Currently selected unit — one of the values passed via `unitOptions`. */
  unit: Unit;
  /** Numeric value. `null` renders an empty input. */
  value: number | null;
};

type OnValueChangeProps<Unit extends string> = {
  newValue: MUIUnitInputValue<Unit>;
  event: Parameters<MUINumberInputProps['onValueChange']>[0]['event']
    | Parameters<MUISelectProps<StrObjOption>['onValueChange']>[0]['event'];
};

type ValueInputProps = Omit<
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
  | 'stepAmount'
  | 'min'
  | 'max'
  | 'renderValue'
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
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
> = {
  /**
   * Name/path of the field's two underlying controls, kept separate,
   * so each can be registered independently against a flat form schema.
   *
   * E.g. `{ unit: 'weightUnit', value: 'weight' }`.
   */
  fieldName: {
    unit: string;
    value: string;
  };
  /**
   * Current value of the field. `unit` and `value` are always reported
   * together through `onValueChange`, even though they're two controls.
   */
  value?: NoInfer<MUIUnitInputValue<ResolvedUnit<Option, ValueKey>>>;
  /**
   * Called whenever either the **unit** or the **value** changes. Always
   * receives the full `{ unit, value }` value - utilize `newValue.unit` /
   * `newValue.value` as needed.
   */
  onValueChange: ({
    newValue,
    event
  }: OnValueChangeProps<ResolvedUnit<Option, ValueKey>>) => void;
  /**
   * Units selectable from the dropdown — a plain string array (e.g.
   * `['USD', 'EUR', 'GBP']`, or a string-literal union/enum's values for
   * literal-union safety on `value.unit`/`newValue.unit`), or an object
   * array read via `labelKey`/`valueKey`, same convention as `MUISelect`.
   * The resolved unit value is always a `string`.
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
   * Which side the **unit** `Select` renders on relative to the **value** input.
   * @default 'end'
   */
  unitPosition?: 'start' | 'end';
  /**
   * Width of the **unit** `Select` as a CSS `flex-basis` value — a
   * percentage (e.g. `'30%'`) or fixed width (e.g. `'100px'`), so the **value**
   * input (`flex: 1`) fills the rest. Accepts a single value or a
   * responsive `sx`-style breakpoint object (e.g. `{ xs: '40%', md: '30%' }`).
   * When omitted, the **unit** `Select` sizes to its selected content instead of a
   * fixed share of the pill.
   */
  unitWidth?: ResponsiveStyleValue<string>;
  /**
   * Props forwarded to the internal `MUINumberInput` to determine the **value**
   * of the field.
   */
  valueInputProps?: ValueInputProps;
  /**
   * Props forwarded to the internal `MUISelect` to choose the **unit**
   * for the field.
   */
  unitSelectProps?: UnitSelectProps<Option, LabelKey, ValueKey>;
  /**
   * When `true`, only integer values are allowed. Cannot be used
   * together with `maxDecimalPlaces`.
   */
  onlyIntegers?: MUINumberInputProps['onlyIntegers'];
  /**
   * When `true`, negative values are not allowed. Acts as an implicit
   * `min` of `0`.
   */
  nonNegative?: MUINumberInputProps['nonNegative'];
  /**
   * Maximum number of decimal places allowed in the field **value**.
   * Cannot be used together with `onlyIntegers`.
   */
  maxDecimalPlaces?: MUINumberInputProps['maxDecimalPlaces'];
  /**
   * The amount to increase/decrease value when using arrow keys.
   * @default 1
   */
  stepAmount?: MUINumberInputProps['stepAmount'];
  /**
   * Lower bound for the field **value**. When `nonNegative` is `true`,
   * `0` is used as the effective lower bound, unless overridden by the
   * value of this prop.
   */
  min?: MUINumberInputProps['min'];
  /**
   * Upper bound for the field **value**.
   */
  max?: MUINumberInputProps['max'];
  /**
   * Formats the numeric **value** for display — e.g. thousands separators or a
   * currency prefix: `value => value?.toLocaleString() ?? ''`. Forwarded to the
   * internal `MUINumberInput`; the raw number is shown while the value input is
   * focused and `value.value` stays a real `number | null`.
   */
  renderValue?: MUINumberInputProps['renderValue'];
  /**
   * Props forwarded to the outer pill container wrapping the **value**
   * input and **unit** `Select`. `containerProps.sx` is merged with the
   * component's own base pill styles (border, radius, focus ring) rather
   * than replacing them, and accepts any `sx` form — object, array, or function.
   */
  containerProps?: Omit<BoxProps, 'children'>;
  /**
   * Props forwarded to the vertical divider between the **value** input and
   * the **unit** `Select` (a plain `Box` with `borderLeft`/`borderColor`).
   */
  dividerProps?: Omit<BoxProps, 'children'>;
  /**
   * When `true`, renders the field label above the form field instead of inside
   * or beside it.
   */
  showLabelAboveFormField?: boolean;
  /**
   * Custom field label. Defaults to a humanized version of `fieldName.value`.
   */
  label?: ReactNode;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: MUINumberInputProps['formLabelProps'];
  /**
   * When `true`, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * When `true`, marks both the **unit** and **value** controls as required.
   */
  required?: boolean;
  /**
   * Placeholder shown in the empty **value** input.
   */
  placeholder?: string;
  /**
   * When `true`, disables both the **unit** and **value** controls.
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
   * If `true`, hides the error message text while keeping the field in an error state.
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
   * Custom ids for the **unit** and **value** controls respectively.
   */
  customIds?: {
    unit?: CustomComponentIds;
    value?: CustomComponentIds;
  };
};

/**
 * A pill-shaped `MUINumberInput` + `MUISelect` combo — a numeric **value**
 * paired with a **unit** picker (currency, weight, temperature, anything),
 * rendered borderless inside one bordered pill and divided by a single
 * border.
 *
 * `unitOptions` accepts either a plain string array or an array of objects
 * read via `labelKey`/`valueKey`, same convention as `MUISelect`; the
 * resolved unit value is always a `string`.
 *
 * `fieldName`/`customIds` take one entry per control (`unit`/`value`) so
 * each can be registered independently against a flat form schema; `value`/
 * `onValueChange` still report the pair together as one `{ unit, value }`
 * object.
 *
 * Docs: [MUIUnitInput](https://mui-components-docs.vercel.app/components/mui/unit-input)
 *
 * API: [MUIUnitInputProps](https://mui-components-docs.vercel.app/components/mui/unit-input#api)
 */
const MUIUnitInput = <
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
>({
  fieldName,
  value,
  onValueChange,
  unitOptions,
  labelKey,
  valueKey,
  unitPosition = 'end',
  unitWidth,
  valueInputProps,
  unitSelectProps,
  placeholder,
  onlyIntegers,
  nonNegative,
  maxDecimalPlaces,
  stepAmount,
  min,
  max,
  renderValue,
  label,
  containerProps,
  dividerProps,
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
  customIds
}: MUIUnitInputProps<Option, LabelKey, ValueKey>) => {
  if (!fieldName.unit || !fieldName.value) {
    throw new Error(generateUnitInputFieldNameErrMsg());
  }

  const {
    fieldId: valueFieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName.value, customIds?.value);

  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const fieldLabel = label ?? fieldNameToLabel(fieldName.value);

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
    ?? (unitOptions.length > 0
      ? getOptionValue(unitOptions[0], valueKey)
      : ('' as ResolvedUnit<Option, ValueKey>));

  const valueInput = (
    <Box
      sx={{
        flex: '1 1 auto',
        minWidth: MIN_SEGMENT_WIDTH
      }}
    >
      <MUINumberInput
        {...valueInputProps}
        fieldName={fieldName.value}
        value={value?.value ?? null}
        onValueChange={({ newValue, event }) => {
          onValueChange({
            newValue: {
              unit: resolvedUnit,
              value: newValue
            },
            event
          });
        }}
        placeholder={placeholder}
        onlyIntegers={onlyIntegers}
        nonNegative={nonNegative}
        maxDecimalPlaces={maxDecimalPlaces}
        stepAmount={stepAmount}
        min={min}
        max={max}
        renderValue={renderValue}
        disabled={disabled}
        required={required}
        customIds={customIds?.value}
        hideLabel
        hideErrorMessage
        variant="standard"
        slotProps={{
          ...valueInputProps?.slotProps,
          input: ownerState => {
            const externalInputProps = typeof valueInputProps?.slotProps?.input === 'function'
              ? valueInputProps.slotProps.input(ownerState)
              : valueInputProps?.slotProps?.input;
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
        value={resolvedUnit}
        onValueChange={({ newValue, event }) => {
          onValueChange({
            newValue: {
              unit: newValue,
              value: value?.value ?? null
            },
            event
          });
        }}
        disabled={disabled}
        required={required}
        customIds={customIds?.unit}
        hideLabel
        hideErrorMessage
        variant="standard"
        multiple={false}
        sx={mergeSx(
          {
            '&:before, &:after': { display: 'none' }
          },
          unitSelectProps?.sx
        )}
      />
    </Box>
  );

  const divider = (
    <Box
      {...dividerProps}
      sx={mergeSx(
        {
          borderLeft: '1px solid',
          borderColor: 'divider'
        },
        dividerProps?.sx
      )}
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
            htmlFor: valueFieldId
          }}
        />
      )}
      <Box
        {...containerProps}
        sx={mergeSx(
          {
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
            }
          },
          containerProps?.sx
        )}
      >
        {unitPosition === 'start' && unitSelect}
        {unitPosition === 'start' && divider}
        {valueInput}
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
