'use client';

/**
 * MUIOTPInput example — controlled with plain React state (no form library
 * needed). Covers `length`, `separatorIndexes` + `separator`, `alphanumeric`,
 * `textFieldProps`, `showLabelAboveFormField` and validation surfaced through
 * `errorMessage`.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MUIOTPInput from '@nish1896/mui-components/mui/otp-input';
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

type OTPFormValues = {
  smsCode: string;
  licenseKey: string;
};

const initialValues: OTPFormValues = {
  smsCode: '',
  licenseKey: ''
};

export default function OTPInputForm() {
  const pathName = usePathname();
  const [values, setValues] = useState<OTPFormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [disableAllFields, setDisableAllFields] = useState(false);

  const errors = {
    smsCode: values.smsCode.length < 6 ? 'Enter all 6 digits' : undefined,
    licenseKey:
      values.licenseKey.length < 10 ? 'Enter all 10 characters' : undefined
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (errors.smsCode || errors.licenseKey) {
      return;
    }
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(values);
  };

  return (
    <FormContainer>
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
          <FieldVariantInfo title="6-digit numeric SMS code" />
          <MUIOTPInput
            fieldName="smsCode"
            value={values.smsCode}
            onValueChange={({ newValue }) =>
              setValues(prev => ({ ...prev, smsCode: newValue }))}
            required
            disabled={disableAllFields}
            errorMessage={submitted ? errors.smsCode : undefined}
            helperText="Type or paste the code from your text message"
          />
        </Grid>

        <Grid size={12}>
          <FieldVariantInfo title="10-char alphanumeric key, grouped 3-4-3, label above" />
          <MUIOTPInput
            fieldName="licenseKey"
            label="License key"
            value={values.licenseKey}
            onValueChange={({ newValue }) =>
              setValues(prev => ({ ...prev, licenseKey: newValue }))}
            length={10}
            alphanumeric
            separatorIndexes={[2, 6]}
            separator="–"
            showLabelAboveFormField
            disabled={disableAllFields}
            errorMessage={submitted ? errors.licenseKey : undefined}
            textFieldProps={{
              size: 'small',
              color: 'info',
              sx: {
                width: '60px',
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                '& .MuiOutlinedInput-input': { color: '#007ABA' }
              }
            }}
            helperText="Letters and digits; paste distributes across the boxes"
          />
        </Grid>

        <Grid size={12}>
          <SubmitButton onClick={handleSubmit}/>
          <ResetButton
            onClick={() => {
              setValues(initialValues);
              setSubmitted(false);
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormState
            formValues={values}
            errors={submitted ? errors : {}}
          />
        </Grid>
      </GridContainer>
    </FormContainer>
  );
}
