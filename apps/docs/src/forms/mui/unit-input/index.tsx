'use client';

/**
 * MUIUnitInput example — plain React `useState`. Shows a currency field
 * (string units, unit on the right) and a generic weight field (a
 * string-literal union `Unit` type, unit on the left) to demonstrate
 * `unitPosition` and that `newValue.unit` keeps its literal type.
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

export default function UnitInputForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const [price, setPrice] = useState<MUIUnitInputValue>({
    quantity: null,
    unit: 'USD'
  });
  const [weight, setWeight] = useState<MUIUnitInputValue<WeightUnit>>({
    quantity: 5,
    unit: 'kg'
  });

  const formValues = { price, weight };

  async function onFormSubmit() {
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
            <FieldVariantInfo title="Currency amount, unit on the right (default), string units" />
            <MUIUnitInput
              fieldName={{ quantity: 'priceAmount', unit: 'priceUnit' }}
              label="Price"
              value={price}
              onValueChange={({ newValue }) => setPrice(newValue)}
              units={['USD', 'EUR', 'GBP']}
              placeholder="Enter amount"
              nonNegative
              maxDecimalPlaces={2}
              required
              helperText="Amount and currency"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Weight, unit on the left (unitPosition=start), generic literal-union Unit type" />
            <MUIUnitInput<WeightUnit>
              fieldName={{ quantity: 'weightAmount', unit: 'weightUnit' }}
              label="Package weight"
              value={weight}
              onValueChange={({ newValue }) => setWeight(newValue)}
              units={['kg', 'lb']}
              unitPosition="start"
              onlyIntegers
              min={0}
              max={100}
              helperText="kg or lb — try TypeScript-hovering newValue.unit, it's 'kg' | 'lb', not string"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={12}>
            <SubmitButton />
            <ResetButton
              onClick={() => {
                setPrice({ quantity: null, unit: 'USD' });
                setWeight({ quantity: 5, unit: 'kg' });
              }}
            />
          </Grid>
          <Grid size={12}>
            <FormState formValues={formValues} errors={{}} />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
