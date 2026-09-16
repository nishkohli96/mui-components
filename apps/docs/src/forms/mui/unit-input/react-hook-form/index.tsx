'use client';

/**
 * MUIUnitInput example — driven by React Hook Form via the reusable
 * `RHFUnitInput` wrapper (see `./rhf-unit-input`), which wires
 * `MUIUnitInput`'s `{ unit, value }` pair to two RHF field paths through
 * nested `Controller`s, and validated with Zod (`unitInputFormSchema` in
 * `./validation`) via `zodResolver`. The same wrapper is reused for both
 * fields below: a distance field (flat field paths, object `unitOptions`
 * via `labelKey`/`valueKey`, unit on the left, `renderValue` reformatting
 * per selected unit), and a file-size field (nested `storage.unit` /
 * `storage.amount` field paths, plain string `unitOptions`, responsive
 * `unitWidth`, `containerProps`/`dividerProps` plus `sx` overrides on the
 * internal value `MUINumberInput` and unit `MUISelect`).
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import RHFUnitInput from './rhf-unit-input';
import { unitInputFormSchema } from './validation';

type DistanceUnit = 'km' | 'mi' | 'nmi';
type StorageUnit = 'KB' | 'MB' | 'GB' | 'TB';

type DistanceOption = {
  code: DistanceUnit;
  label: string;
};

type UnitInputFormValues = {
  distanceUnit: DistanceUnit;
  distanceAmount: number | null;
  storage: {
    unit: StorageUnit;
    amount: number | null;
  };
};

const distanceOptions: DistanceOption[] = [
  { code: 'km', label: 'Kilometers' },
  { code: 'mi', label: 'Miles' },
  { code: 'nmi', label: 'Nautical miles' },
];

const initialValues: Partial<UnitInputFormValues> = {
  // distanceUnit: 'km',
  // distanceAmount: null,
  storage: {
    unit: 'MB',
    amount: 500,
  }
};

export default function UnitInputRHFForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<UnitInputFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(unitInputFormSchema)
  });
  const formValues = useWatch({ control });
  const distanceUnit = useWatch({ control, name: 'distanceUnit' });

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
            <FieldVariantInfo title="Distance, object unitOptions via labelKey/valueKey, unit on the left, getOptionDisabled, and renderValue reformatting per selected unit" />
            <RHFUnitInput
              control={control}
              fieldName={{ unit: 'distanceUnit', value: 'distanceAmount' }}
              label="Distance"
              unitOptions={distanceOptions}
              labelKey="label"
              valueKey="code"
              unitPosition="start"
              unitSelectProps={{
                getOptionDisabled: opn => opn.code === 'nmi',
                placeholder: 'Unit'
              }}
              placeholder="Enter distance"
              nonNegative
              maxDecimalPlaces={2}
              renderValue={val => val === null
                ? ''
                : `${val.toLocaleString()} ${distanceUnit}`}
              required
              errorMessage={errors.distanceAmount?.message}
              helperText="Blur to see it reformatted with the selected unit"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="File size, nested storage.unit/storage.amount field paths, plain string unitOptions, responsive unitWidth (40% on mobile, 30% from md up), containerProps, dividerProps, and sx overrides" />
            <RHFUnitInput
              control={control}
              fieldName={{ unit: 'storage.unit', value: 'storage.amount' }}
              label="File size"
              unitOptions={['MB', 'GB', 'TB']}
              unitWidth={{ xs: '40%', md: '30%' }}
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
              min={0}
              stepAmount={10}
              required
              errorMessage={errors.storage?.amount?.message}
              helperText="Only integers, stepAmount: 10, containerProps, dividerProps, valueInputProps.sx, unitSelectProps.sx all overridden here"
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
