'use client';

/**
 * MUIUnitInput example — plain React `useState`. Shows a currency field
 * (object `unitOptions` via `labelKey`/`valueKey`, unit on the left), a
 * generic weight field (plain string `unitOptions`, responsive `unitWidth`),
 * and a temperature field exercising `containerProps`/`dividerProps` plus
 * `sx` overrides on the internal value `MUINumberInput` and unit
 * `MUISelect`. All three are `required` and validated on submit.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MUIUnitInput, { type MUIUnitInputValue } from '@nish1896/mui-components/mui/unit-input';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
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

export default function UnitInputForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const [price, setPrice] = useState<MUIUnitInputValue<Currency>>({
    unit: 'USD',
    value: null
  });
  const [weight, setWeight] = useState<MUIUnitInputValue<WeightUnit>>({
    unit: 'kg',
    value: 5
  });

  const [temperature, setTemperature] = useState<MUIUnitInputValue<TemperatureUnit>>({
    unit: '°C',
    value: null
  });

  const [priceError, setPriceError] = useState<string>();
  const [weightError, setWeightError] = useState<string>();
  const [temperatureError, setTemperatureError] = useState<string>();

  const formValues = { price, weight, temperature };
  const errors = { price: priceError, weight: weightError, temperature: temperatureError };

  function resetForm() {
    setPrice({ unit: 'USD', value: null });
    setWeight({ unit: 'kg', value: 5 });
    setTemperature({ unit: '°C', value: null });
    setPriceError(undefined);
    setWeightError(undefined);
    setTemperatureError(undefined);
  }

  async function onFormSubmit() {
    const priceMissing = price.value === null;
    const weightMissing = weight.value === null;
    const temperatureMissing = temperature.value === null;
    setPriceError(priceMissing ? 'Price is required' : undefined);
    setWeightError(weightMissing ? 'Weight is required' : undefined);
    setTemperatureError(temperatureMissing ? 'Temperature is required' : undefined);
    if (priceMissing || weightMissing || temperatureMissing) {
      return;
    }
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer>
      <form
        onSubmit={event => {
          event.preventDefault();
          onFormSubmit();
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
            <FieldVariantInfo title="Currency, object unitOptions via labelKey/valueKey, unit on the left, renderOption/getOptionDisabled, and renderValue reformatting per selected currency" />
            <MUIUnitInput
              fieldName={{
                unit: 'priceUnit',
                value: 'priceAmount'
              }}
              label="Price"
              value={price}
              onValueChange={({ newValue }) => {
                setPrice(newValue);
                setPriceError(undefined);
              }}
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
                const { locale, currency } = currencyFormat[price.unit];
                return val.toLocaleString(locale, {
                  style: 'currency',
                  currency
                });
              }}
              required
              errorMessage={priceError}
              helperText="Blur to see it formatted as the selected currency"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Weight, plain string unitOptions, responsive unitWidth (40% on mobile, 30% from md up)" />
            <MUIUnitInput
              fieldName={{
                unit: 'weightUnit',
                value: 'weightAmount'
              }}
              label="Package weight"
              value={weight}
              onValueChange={({ newValue }) => {
                setWeight(newValue);
                setWeightError(undefined);
              }}
              unitOptions={['kg', 'lb']}
              unitWidth={{ xs: '40%', md: '30%' }}
              onlyIntegers
              min={0}
              max={150}
              stepAmount={5}
              required
              errorMessage={weightError}
              helperText="Only Integers, stepAmount: 5, max limit: 150"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Temperature — containerProps, dividerProps, and sx overrides on the internal quantity input & unit Select" />
            <MUIUnitInput
              fieldName={{
                unit: 'temperatureUnit',
                value: 'temperatureAmount'
              }}
              label="Target temperature"
              value={temperature}
              onValueChange={({ newValue }) => {
                setTemperature(newValue);
                setTemperatureError(undefined);
              }}
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
              errorMessage={temperatureError}
              helperText="containerProps/dividerProps/valueInputProps.sx/unitSelectProps.sx all overridden here"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={resetForm} />
          </Grid>
          <Grid size={12}>
            <FormState formValues={formValues} errors={errors} />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
