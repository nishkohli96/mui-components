'use client';

/**
 * MUIRadioGroup example — plain React `useState`. Shows string options, object
 * options with `labelKey` / `valueKey` + `getOptionDisabled`, pass-through
 * `radioProps`, a custom `renderOptionLabel`, label placement above the group,
 * and required validation via `errorMessage`.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import MUIRadioGroup from '@nish1896/mui-components/mui/radio-group';
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

const planOptions = ['Free', 'Pro', 'Enterprise'];

type BillingOption = { id: string; title: string; disabled?: boolean };

const billingOptions: BillingOption[] = [
  { id: 'monthly', title: 'Monthly' },
  { id: 'yearly', title: 'Yearly (2 months free)' },
  { id: 'lifetime', title: 'Lifetime (coming soon)', disabled: true }
];

const initialValues = {
  plan: 'Free' as string | null,
  billing: 'monthly' as string | null,
  contact: null as string | null
};

export default function RadioGroupForm() {
  const pathName = usePathname();

  const [plan, setPlan] = useState(initialValues.plan);
  const [billing, setBilling] = useState(initialValues.billing);
  const [contact, setContact] = useState(initialValues.contact);
  const [contactError, setContactError] = useState<string>();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const formValues = { plan, billing, contact };
  const errors = { contact: contactError };

  function resetForm() {
    setPlan(initialValues.plan);
    setBilling(initialValues.billing);
    setContact(initialValues.contact);
    setContactError(undefined);
  }

  async function onFormSubmit() {
    if (!contact) {
      setContactError('Select a preferred contact method');
      return;
    }
    setContactError(undefined);
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer title="MUIRadioGroup">
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
            <FieldVariantInfo title="String options with helper text" />
            <MUIRadioGroup
              fieldName="plan"
              options={planOptions}
              value={plan}
              onValueChange={({ newValue }) => setPlan(newValue)}
              helperText="Pick the plan that fits your team"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Object options, disabled item & radio colour" />
            <MUIRadioGroup<BillingOption, 'title', 'id'>
              fieldName="billing"
              label="Billing cycle"
              options={billingOptions}
              labelKey="title"
              valueKey="id"
              value={billing}
              onValueChange={({ newValue }) => setBilling(newValue)}
              getOptionDisabled={option => Boolean(option.disabled)}
              radioProps={{ color: 'secondary' }}
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Required, custom option render & label above" />
            <MUIRadioGroup
              fieldName="contact"
              label="Preferred contact"
              options={['Email', 'Phone', 'SMS']}
              value={contact}
              onValueChange={({ newValue }) => {
                setContact(newValue);
                setContactError(undefined);
              }}
              renderOptionLabel={option => (
                <Typography component="span" sx={{ fontWeight: 500 }}>
                  {option}
                  {' '}
                  me
                </Typography>
              )}
              showLabelAboveFormField
              required
              errorMessage={contactError}
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
