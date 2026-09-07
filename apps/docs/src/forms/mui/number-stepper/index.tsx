'use client';

/**
 * MUINumberStepper example — integrated with TanStack Form
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
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MUINumberStepper from '@nish1896/mui-components/mui/number-stepper';
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

type NumberStepperFormValues = {
  quantity: number | null;
  price: number | null;
  targetTemp: number | null;
};

const initialValues: NumberStepperFormValues = {
  quantity: 1,
  price: null,
  targetTemp: 20
};

export default function NumberStepperForm() {
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
            <FieldVariantInfo title="Integer only, bounded 1–10, rectangular (sx override)" />
            <form.Field
              name="quantity"
              validators={{
                onChange: ({ value }) =>
                  (value === null ? 'Quantity is required' : undefined)
              }}
            >
              {field => (
                <MUINumberStepper
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
                  sx={{ borderRadius: '8px' }}
                />
              )}
            </form.Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Decimal (2 places), step ±0.5, label above field, larger buttons (iconButtonProps override)" />
            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) => {
                  if (value === null) {
                    return 'Price is required';
                  }
                  return value < 0 ? 'Price cannot be negative' : undefined;
                }
              }}
            >
              {field => (
                <MUINumberStepper
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
                  required
                  disabled={disableAllFields}
                  iconButtonProps={{ size: 'large' }}
                />
              )}
            </form.Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Custom step (±2), bounded 16–30, custom icons, tighter caption padding (sx override)" />
            <form.Field
              name="targetTemp"
              validators={{
                onChange: ({ value }) =>
                  (value === null ? 'Target temp is required' : undefined)
              }}
            >
              {field => (
                <MUINumberStepper
                  fieldName="targetTemp"
                  label="Target temp (°C)"
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange(newValue)}
                  errorMessage={tanstackErrors(field.state.meta.errors)}
                  onlyIntegers
                  min={16}
                  max={30}
                  stepAmount={2}
                  required
                  swapIcons
                  decrementIcon={<span>▼</span>}
                  incrementIcon={<span>▲</span>}
                  caption={(
                    <>
                      <DeviceThermostatIcon sx={{ fontSize: 14 }} />
                      Bedrooms
                    </>
                  )}
                  helperText="Arrow keys / steppers change by 2"
                  disabled={disableAllFields}
                  sx={{
                    '& input[type=number]': { paddingBottom: '12px' }
                  }}
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
