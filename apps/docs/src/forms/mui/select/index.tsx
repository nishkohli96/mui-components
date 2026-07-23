'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { faker } from '@faker-js/faker';
import { toast } from 'react-toastify';
import MUISelect from '@nish1896/mui-components/mui/select';
import {
  FormContainer,
  FormState,
  GridContainer,
  FieldVariantInfo,
  SubmitButton,
  ResetButton
} from '@/components';
import { IPLTeams, formSubmitEventName } from '@/constants';
import { Colors } from '@/types';
import { logFirebaseEvent, showToastMessage } from '@/utils';
import { FormSchema } from './validation';

const randomNumbers = [23, 56, 67, 32, 68, 54, 90];

const getLanguagesList = (count: number) => {
  const languages = new Set<string>();
  while (languages.size < count) {
    languages.add(faker.location.language().name);
  }
  return Array.from(languages);
};

const initialValues = { favouriteColor: Colors.Orange };

const SelectForm = () => {
  const pathName = usePathname();
  const languagesList = useMemo(() => getLanguagesList(10), []);
  const [disableAllFields, setDisableAllFields] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormSchema>({
    defaultValues: initialValues,
    resolver: classValidatorResolver(FormSchema),
    disabled: disableAllFields
  });
  const formValues = useWatch({ control });
  const favouriteColor = useWatch({
    control,
    name: 'favouriteColor'
  });

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
            <FieldVariantInfo title="Single select field with helpertext and renderOptionLabel" />
            <MUISelect
              fieldName="favouriteColor"
              value={formValues.favouriteColor}
              onValueChange={({ newValue }) => {
                setValue('favouriteColor', newValue as Colors, {
                  shouldValidate: true
                });
              }}
              options={Object.values(Colors)}
              disabled={disableAllFields}
              renderOptionLabel={opn => (
                <span style={{ color: opn }}>
                  {opn}
                </span>
              )}
              {...(favouriteColor && {
                helperText: (
                  <Typography color={favouriteColor}>
                    {`Select an option to change selected text color from ${favouriteColor}`}
                  </Typography>
                )
              })}
              errorMessage={errors.favouriteColor?.message?.toString()}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Single select with multiple options as an array of strings and customIds" />
            <MUISelect
              fieldName="languages"
              value={formValues.languages}
              onValueChange={({ newValue }) => {
                setValue('languages', newValue as string[], {
                  shouldValidate: true
                });
              }}
              options={languagesList}
              disabled={disableAllFields}
              errorMessage={errors.languages?.message?.toString()}
              multiple
              required
              customIds={{ field: 'languages-field' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Multiple Select with options as an array of objects, with custom render function, customOnChange and disabled options" />
            <MUISelect
              fieldName="iplTeams"
              value={formValues.iplTeams}
              onValueChange={({ newValue, event }) => {
                if (newValue.length > 4) {
                  event.preventDefault();
                  return;
                }
                setValue('iplTeams', newValue as string[], {
                  shouldValidate: true
                });
              }}
              options={IPLTeams}
              disabled={disableAllFields}
              labelKey="name"
              valueKey="abbr"
              showLabelAboveFormField
              placeholder="Choose IPL teams"
              showDefaultOption
              defaultOptionText="--- Select IPL teams ---"
              label={
                <div style={{ color: '#27bb40' }}>
                  Select your favourite IPL teams
                </div>
              }
              renderOptionLabel={option => (
                <span>
                  {`${option.name} (${option.abbr})`}
                </span>
              )}
              getOptionDisabled={option =>
                ['LSG', 'RR'].includes(option.abbr)}
              errorMessage={errors.iplTeams?.message?.toString()}
              required
              multiple
              helperText="Select one or more teams"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Select with number options" />
            <MUISelect
              fieldName="randomNum"
              value={formValues.randomNum}
              options={randomNumbers}
              disabled={disableAllFields}
              onValueChange={({ newValue }) => {
                setValue('randomNum', newValue as number, {
                  shouldValidate: true
                });
                toast.info(JSON.stringify(newValue, null, 2));
              }}
              errorMessage={errors.randomNum?.message?.toString()}
              showDefaultOption
              showLabelAboveFormField
              hideLabel
              helperText="Select a random number"
              required
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
};

export default SelectForm;
