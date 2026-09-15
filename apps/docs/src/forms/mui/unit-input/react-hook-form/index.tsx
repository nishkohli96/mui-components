'use client';

/**
 * MUIUnitInput example — driven by React Hook Form via the reusable
 * `RHFUnitInput` wrapper (see `@/components/rhf-unit-input`), which wires
 * `MUIUnitInput`'s `{ unit, value }` pair to two RHF field paths through
 * nested `Controller`s. The same wrapper is reused for all three fields
 * below: a currency field (object `unitOptions` via `labelKey`/`valueKey`,
 * unit on the left), a generic weight field (plain string `unitOptions`,
 * responsive `unitWidth`), and a temperature field exercising
 * `containerProps`/`dividerProps` plus `sx` overrides on the internal value
 * `MUINumberInput` and unit `MUISelect`. All three are `required` and
 * validated via RHF's own `registerOptions`.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  RHFUnitInput,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { showToastMessage, logFirebaseEvent } from '@/utils';

type WeightUnit = 'kg' | 'lb';
type TemperatureUnit = '°C' | '°F';
type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'YEN';

type CurrencyOption = {
  code: Currency;
  label: string;
  symbol: string;
};

type UnitInputFormValues = {
  priceUnit: Currency;
  priceAmount: number | null;
  weightUnit: WeightUnit;
  weightAmount: number | null;
  temperatureUnit: TemperatureUnit;
  temperatureAmount: number | null;
};

const currencyOptions: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'YEN', label: 'Yen', symbol: '¥' },
];

/**
 * Locale + ISO 4217 code per selectable currency, so `toLocaleString` groups
 * (e.g. INR uses the lakh/crore system) and picks the right symbol.
 */
const currencyFormat: Record<Currency, { locale: string; currency: string }> = {
  USD: { locale: 'en-US', currency: 'USD' },
  INR: { locale: 'en-IN', currency: 'INR' },
  EUR: { locale: 'de-DE', currency: 'EUR' },
  GBP: { locale: 'en-GB', currency: 'GBP' },
  YEN: { locale: 'ja-JP', currency: 'JPY' }
};

const initialValues: UnitInputFormValues = {
  priceUnit: 'USD',
  priceAmount: null,
  weightUnit: 'kg',
  weightAmount: 5,
  temperatureUnit: '°C',
  temperatureAmount: null
};

export default function UnitInputForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<UnitInputFormValues>({ defaultValues: initialValues });
  const formValues = useWatch({ control });
  const priceUnit = useWatch({ control, name: 'priceUnit' });

  async function onFormSubmit(values: UnitInputFormValues) {
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(values);
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onFormSubmit)}>
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
            <FieldVariantInfo title="Currency, object unitOptions via labelKey/valueKey, unit on the left, renderOption/getOptionDisabled, and renderValue reformatting per selected currency" />
            <RHFUnitInput<UnitInputFormValues, CurrencyOption, 'label', 'code'>
              control={control}
              fieldName={{ unit: 'priceUnit', value: 'priceAmount' }}
              label="Price"
              unitOptions={currencyOptions}
              labelKey="label"
              valueKey="code"
              unitPosition="start"
              unitSelectProps={{
                renderOptionLabel: opn => `${opn.label} (${opn.symbol})`,
                getOptionDisabled: opn => opn.code === 'YEN'
              }}
              placeholder="Enter amount"
              nonNegative
              maxDecimalPlaces={2}
              renderValue={val => {
                if (val === null) {
                  return '';
                }
                const { locale, currency } = currencyFormat[priceUnit];
                return val.toLocaleString(locale, {
                  style: 'currency',
                  currency
                });
              }}
              required
              valueRegisterOptions={{ required: 'Price is required' }}
              helperText="Blur to see it formatted as the selected currency"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Weight, plain string unitOptions, responsive unitWidth (40% on mobile, 30% from md up)" />
            <RHFUnitInput<UnitInputFormValues>
              control={control}
              fieldName={{ unit: 'weightUnit', value: 'weightAmount' }}
              label="Package weight"
              unitOptions={['kg', 'lb']}
              unitWidth={{ xs: '40%', md: '30%' }}
              onlyIntegers
              min={0}
              max={150}
              stepAmount={5}
              required
              valueRegisterOptions={{ required: 'Weight is required' }}
              helperText="Only Integers, stepAmount: 5, max limit: 150"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Temperature — containerProps, dividerProps, and sx overrides on the internal quantity input & unit Select" />
            <RHFUnitInput<UnitInputFormValues>
              control={control}
              fieldName={{ unit: 'temperatureUnit', value: 'temperatureAmount' }}
              label="Target temperature"
              unitOptions={['°C', '°F']}
              containerProps={{
                sx: {
                  borderColor: 'info.main',
                  bgcolor: 'action.hover'
                }
              }}
              dividerProps={{
                sx: { borderColor: 'info.main' }
              }}
              valueInputProps={{
                sx: {
                  '& input[type=number]': {
                    fontWeight: 700,
                    color: 'secondary.dark'
                  }
                }
              }}
              unitSelectProps={{
                sx: {
                  fontStyle: 'italic',
                  color: 'success.dark'
                }
              }}
              onlyIntegers
              min={-50}
              max={150}
              required
              valueRegisterOptions={{ required: 'Temperature is required' }}
              helperText="containerProps/dividerProps/valueInputProps.sx/unitSelectProps.sx all overridden here"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={() => reset(initialValues)} />
          </Grid>
          <Grid size={12}>
            <FormState
              formValues={formValues}
              errors={Object.fromEntries(
                Object.entries(errors).map(([key, error]) => [key, error?.message?.toString()])
              )}
            />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
