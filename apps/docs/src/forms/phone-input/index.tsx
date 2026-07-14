'use client';

/**
 * MUIPhoneInput example — integrated with Formik. `onValueChange` always emits
 * the structured `MUIPhoneInputValue` ({ phone, country, dialCode, phoneNo }).
 * Shows a default country + validation on `phoneNo`, and a second field with
 * `preferredCountries`, `forceDialCode`, a hidden country search and a label
 * above the field.
 */

import { useFormik } from 'formik';
import { usePathname } from 'next/navigation';
import { type CountryIso2 } from 'react-international-phone';
import Grid from '@mui/material/Grid';
import MUIPhoneInput, {
  type MUIPhoneInputValue
} from '@nish1896/mui-components/misc/phone-input';
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

const preferredCountries: CountryIso2[] = ['us', 'gb', 'in', 'de'];

type PhoneFormValues = {
  contactNumber: MUIPhoneInputValue | null;
  workNumber: MUIPhoneInputValue | null;
};

const initialValues: PhoneFormValues = {
  contactNumber: null,
  workNumber: null
};

export default function PhoneInputForm() {
  const pathName = usePathname();

  const formik = useFormik<PhoneFormValues>({
    initialValues,
    validate: values => {
      const errors: Partial<Record<keyof PhoneFormValues, string>> = {};
      const phoneNo = values.contactNumber?.phoneNo;
      if (!phoneNo) {
        errors.contactNumber = 'Enter your phone number';
      } else if (phoneNo.length < 6) {
        errors.contactNumber = 'Phone number looks too short';
      }
      return errors;
    },
    onSubmit: async values => {
      await logFirebaseEvent(formSubmitEventName, { pathName });
      showToastMessage(values);
    }
  });

  return (
    <FormContainer title="MUIPhoneInput">
      <form onSubmit={formik.handleSubmit}>
        <GridContainer>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Default country (US) with validation" />
            <MUIPhoneInput
              fieldName="contactNumber"
              value={formik.values.contactNumber}
              onValueChange={({ newValue }) => formik.setFieldValue('contactNumber', newValue)}
              phoneInputProps={{ defaultCountry: 'us' }}
              required
              errorMessage={formik.submitCount > 0 && formik.errors.contactNumber}
              helperText="Include your area code"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Preferred countries, forced dial code, no search" />
            <MUIPhoneInput
              fieldName="workNumber"
              label="Work number"
              value={formik.values.workNumber}
              onValueChange={({ newValue }) => formik.setFieldValue('workNumber', newValue)}
              phoneInputProps={{
                defaultCountry: 'gb',
                preferredCountries,
                forceDialCode: true
              }}
              searchCountryProps={{ allowCountrySearch: false }}
              showLabelAboveFormField
              variant="standard"
              helperText="Dial code can't be edited by hand"
            />
          </Grid>

          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={() => formik.resetForm()} />
          </Grid>
          <Grid size={12}>
            <FormState
              formValues={formik.values}
              errors={{
                contactNumber: formik.submitCount > 0 && typeof formik.errors.contactNumber === 'string'
                  ? formik.errors.contactNumber
                  : undefined
              }}
            />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
