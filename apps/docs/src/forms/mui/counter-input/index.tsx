'use client';

/**
 * MUICounterInput example — integrated with TanStack Form
 * (`@tanstack/react-form`) to show the always-visible `-` / `+` steppers
 * alongside the shared numeric constraints: `onlyIntegers`, `nonNegative`,
 * `maxDecimalPlaces`, `stepAmount`, plus the stepper-only `min` / `max`
 * bounds that clamp stepping and disable the relevant button at the limit.
 *
 * `field.state.meta.errors` is passed to `errorMessage` as-is — the component
 * resolves the array internally.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MUICounterInput from '@nish1896/mui-components/mui/counter-input';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { showToastMessage, logFirebaseEvent, tanstackErrors } from '@/utils';

type CounterInputFormValues = {
  quantity: number | null;
  price: number | null;
  targetTemp: number | null;
};

const initialValues: CounterInputFormValues = {
  quantity: 1,
  price: null,
  targetTemp: 20
};

export default function CounterInputForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await logFirebaseEvent(formSubmitEventName, { pathName });
      showToastMessage(value);
    }
  });

  return (
    <FormContainer>
      <form
        onSubmit={event => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <GridContainer>
          <Grid size={12}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={disableAllFields}
                  onChange={event => setDisableAllFields(event.target.checked)}
                />
              )}
              label="Disable all fields"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Integer only, bounded 1–10" />
            <form.Field
              name="quantity"
              validators={{
                onChange: ({ value }) =>
                  (value === null ? 'Quantity is required' : undefined)
              }}
            >
              {field => (
                <MUICounterInput
                  fieldName="quantity"
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange(newValue)}
                  onFocus={e => e.target.select()}
                  onBlur={field.handleBlur}
                  errorMessage={tanstackErrors(field.state.meta.errors)}
                  onlyIntegers
                  min={1}
                  max={10}
                  required
                  disabled={disableAllFields}
                  helperText='"−" disabled at 1, "+" disabled at 10'
                />
              )}
            </form.Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Decimal (2 places), step ±0.5, label above field" />
            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) =>
                  (value !== null && value < 0 ? 'Price cannot be negative' : undefined)
              }}
            >
              {field => (
                <MUICounterInput
                  fieldName="price"
                  label="Unit price ($)"
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange(newValue)}
                  onBlur={field.handleBlur}
                  errorMessage={tanstackErrors(field.state.meta.errors)}
                  maxDecimalPlaces={2}
                  nonNegative
                  stepAmount={0.5}
                  showLabelAboveFormField
                  formLabelProps={{ sx: { fontWeight: 600 } }}
                  helperText="Up to two decimal places"
                  disabled={disableAllFields}
                />
              )}
            </form.Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Custom step (±2), bounded 16–30, swapped icons" />
            <form.Field name="targetTemp">
              {field => (
                <MUICounterInput
                  fieldName="targetTemp"
                  label="Target temp (°C)"
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange(newValue)}
                  onlyIntegers
                  min={16}
                  max={30}
                  stepAmount={2}
                  swapIcons
                  helperText="Arrow keys / steppers change by 2"
                  disabled={disableAllFields}
                />
              )}
            </form.Field>
          </Grid>

          <form.Subscribe
            selector={state => ({
              values: state.values,
              fieldMeta: state.fieldMeta,
              canSubmit: state.canSubmit
            })}
          >
            {({ values, fieldMeta, canSubmit }) => {
              const errors = Object.fromEntries(
                Object.entries(fieldMeta).map(([name, meta]) => [
                  name,
                  meta?.errors?.[0]
                ])
              );
              return (
                <>
                  <Grid size={12}>
                    <SubmitButton disabled={!canSubmit} />
                    <ResetButton onClick={() => form.reset()} />
                  </Grid>
                  <Grid size={12}>
                    <FormState
                      formValues={values}
                      errors={errors}
                    />
                  </Grid>
                </>
              );
            }}
          </form.Subscribe>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
