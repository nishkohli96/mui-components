'use client';

/**
 * Generic React Hook Form wrapper around `MUIUnitInput`. `MUIUnitInput` is a
 * plain controlled `value`/`onValueChange` component with no built-in RHF
 * awareness (the library is form-library-agnostic by design — see
 * `@nish1896/rhf-mui-components` for the published RHF wrapper suite, which
 * doesn't cover `unit-input` yet). This wires its `{ unit, value }` pair to
 * two independent RHF field paths via nested `Controller`s, so it can be
 * reused for every unit-input field in a form instead of hand-wiring
 * `useWatch`/`setValue` per field.
 */

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions
} from 'react-hook-form';
import MUIUnitInput, { type MUIUnitInputProps } from '@nish1896/mui-components/mui/unit-input';
import type { StrObjOption } from '@nish1896/mui-components/types';

export type RHFUnitInputProps<
  T extends FieldValues,
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
> = Omit<MUIUnitInputProps<Option, LabelKey, ValueKey>, 'fieldName' | 'value' | 'onValueChange'> & {
  /** React Hook Form control object returned by `useForm`. */
  control: Control<T>;
  /** RHF field paths for the **unit** and **value** controls. */
  fieldName: {
    unit: Path<T>;
    value: Path<T>;
  };
  /** Validation rules for the **unit** field. */
  unitRegisterOptions?: RegisterOptions<T, Path<T>>;
  /** Validation rules for the **value** field. */
  valueRegisterOptions?: RegisterOptions<T, Path<T>>;
};

/**
 * Controlled `MUIUnitInput`, wired to two React Hook Form fields (unit +
 * value) via `control`. Reuse it for every unit/value pair in a form —
 * currency, weight, temperature, anything `MUIUnitInput` itself accepts.
 */
export default function RHFUnitInput<
  T extends FieldValues,
  Option extends StrObjOption = StrObjOption,
  LabelKey extends Extract<keyof Option, string> = Extract<keyof Option, string>,
  ValueKey extends Extract<keyof Option, string> = Extract<keyof Option, string>
>({
  control,
  fieldName,
  unitRegisterOptions,
  valueRegisterOptions,
  unitSelectProps,
  valueInputProps,
  ...unitInputProps
}: RHFUnitInputProps<T, Option, LabelKey, ValueKey>) {
  return (
    <Controller
      name={fieldName.value}
      control={control}
      rules={valueRegisterOptions}
      render={({
        field: {
          value: valueValue,
          onChange: valueOnChange,
          onBlur: valueOnBlur,
          ref: valueRef,
        },
        fieldState: {
          error: valueError
        }
      }) => (
        <Controller
          name={fieldName.unit}
          control={control}
          rules={unitRegisterOptions}
          render={({
            field: {
              value: unitValue,
              onChange: unitOnChange,
              onBlur: unitOnBlur,
            },
            fieldState: {
              error: unitError
            }
          }) => (
            <MUIUnitInput<Option, LabelKey, ValueKey>
              {...unitInputProps}
              fieldName={fieldName}
              value={{
                unit: unitValue,
                value: valueValue
              }}
              onValueChange={({ newValue }) => {
                unitOnChange(newValue.unit);
                valueOnChange(newValue.value);
              }}
              unitSelectProps={{
                ...unitSelectProps,
                onBlur: (unitSelectBlurEvent) => {
                  unitOnBlur();
                  unitSelectProps?.onBlur?.(unitSelectBlurEvent);
                }
              }}
              valueInputProps={{
                ...valueInputProps,
                inputRef: valueRef,
                onBlur: (valueInputBlurEvent) => {
                  valueOnBlur();
                  valueInputProps?.onBlur?.(valueInputBlurEvent);
                }
              }}
              errorMessage={[
                valueError?.message?.toString() ?? '',
                unitError?.message?.toString() ?? '',
              ]}
            />
          )}
        />
      )}
    />
  );
}
