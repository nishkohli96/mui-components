'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MUINativeSelect from '@nish1896/mui-components/mui/native-select';
import {
  FormContainer,
  FormState,
  GridContainer,
  FieldVariantInfo,
  SubmitButton,
  ResetButton
} from '@/components';
import { Currencies, formSubmitEventName } from '@/constants';
import { logFirebaseEvent, showToastMessage } from '@/utils';
import { FormSchema } from './validation';

const NativeSelectForm = () => {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: classValidatorResolver(FormSchema),
    disabled: disableAllFields
  });
  const formValues = useWatch({ control });

  async function onFormSubmit(formValues: FormSchema) {
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer title="Select Component with Class-Validator">
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <GridContainer>
          <Grid size={12}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={disableAllFields}
                  onChange={event => {
                    setDisableAllFields(event.target.checked);
                  }}
                />
              )}
              label="Disable all fields"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Native select with renderOptionLabel & defaultOptionText" />
            <MUINativeSelect<(typeof Currencies)[number]>
              fieldName="currency"
              value={formValues.currency}
              onValueChange={({ newValue }) => {
                setValue('currency', newValue as string, {
                  shouldValidate: true
                });
              }}
              options={Currencies}
              disabled={disableAllFields}
              labelKey="name"
              valueKey="code"
              label="Choose a currency"
              renderOptionLabel={opn => (
                <>
                  {`${opn.code} - ${opn.name} `}
                </>
              )}
              errorMessage={errors.currency?.message?.toString()}
              defaultOptionText="Select currency"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Native select with number options and getOptionDisabled" />
            <MUINativeSelect
              fieldName="ageGroup"
              value={formValues.ageGroup}
              onValueChange={({ newValue }) => {
                setValue('ageGroup', newValue as number, {
                  shouldValidate: true
                });
              }}
              options={[10, 20, 30, 40, 50, 60, 70, 80]}
              disabled={disableAllFields}
              getOptionDisabled={opn => opn === 50}
              label="Choose an age group"
              placeholder="Select age group"
              errorMessage={errors.ageGroup?.message?.toString()}
              required
            />
          </Grid>
          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={() => reset()} />
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
};

export default NativeSelectForm;
