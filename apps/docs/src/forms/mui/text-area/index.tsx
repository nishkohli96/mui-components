'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MUITextArea from '@nish1896/mui-components/mui/text-area';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import type { OptionalString } from '@/types';
import {
  reqdMsg,
  minCharMsg,
  showToastMessage,
  logFirebaseEvent
} from '@/utils';

const bioMaxChars = 150;
const feedbackMaxChars = 50;

const initialValues = {
  bio: undefined,
  feedback: '',
  notes: 'Some initial notes'
};

export default function TextAreaForm() {
  const pathName = usePathname();

  const [bio, setBio] = useState<OptionalString>(initialValues.bio);
  const [bioError, setBioError] = useState<OptionalString>();
  const [feedback, setFeedback] = useState<OptionalString>(initialValues.feedback);
  const [notes, setNotes] = useState<OptionalString>(initialValues.notes);
  const [disableAllFields, setDisableAllFields] = useState(false);

  const formValues = {
    bio,
    feedback,
    notes
  };

  const errors = {
    bio: bioError
  };

  function validateBio(value: OptionalString) {
    if (!value) {
      return reqdMsg('Bio');
    }
    if (value.length < 20) {
      return minCharMsg(20);
    }
    return undefined;
  }

  function validateForm() {
    const nextBioError = validateBio(bio);
    setBioError(nextBioError);
    return !nextBioError;
  }

  function resetForm() {
    setBio(initialValues.bio);
    setFeedback(initialValues.feedback);
    setNotes(initialValues.notes);
    setBioError(undefined);
  }

  async function onFormSubmit() {
    if (!validateForm()) {
      return;
    }
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer>
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
          <FieldVariantInfo title="Auto-growing field with required & min length validation, and an in-field character counter (showCharLimit)" />
          <MUITextArea
            fieldName="bio"
            value={bio}
            onValueChange={({ newValue }) => {
              setBio(newValue);
              setBioError(undefined);
            }}
            onBlur={() => {
              setBioError(validateBio(bio));
            }}
            errorMessage={bioError}
            disabled={disableAllFields}
            maxChars={bioMaxChars}
            showCharLimit
            helperText="Enter at least 20 characters"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldVariantInfo title="Fixed rows with maxChars, and a custom counter via renderCharLimit — typing stops at the limit and pasted text is cut to fit" />
          <MUITextArea
            fieldName="feedback"
            value={feedback}
            onValueChange={({ newValue }) => setFeedback(newValue)}
            variant="filled"
            rows={4}
            maxChars={feedbackMaxChars}
            showCharLimit
            renderCharLimit={(charCount, maxChars) => {
              const isReachingCharLimit = maxChars - charCount <= 10;
              return (
                <Typography
                  variant="caption"
                  color={isReachingCharLimit ? 'error' : 'text.secondary'}
                >
                  {!isReachingCharLimit
                    ? `${charCount}/${maxChars} characters`
                    : `${maxChars - charCount} characters left}`}
                </Typography>
              );
            }}
            disabled={disableAllFields}
            helperText={`Paste a long text — only the first ${feedbackMaxChars} characters are kept`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldVariantInfo title="Label above form-field, with custom ids" />
          <MUITextArea
            fieldName="notes"
            value={notes}
            onValueChange={({ newValue }) => setNotes(newValue)}
            disabled={disableAllFields}
            customIds={{
              field: 'userNotes',
              label: 'userNotes-label'
            }}
            variant="standard"
            showLabelAboveFormField
            formLabelProps={{ sx: { color: 'blue', fontWeight: 600 } }}
          />
        </Grid>
        <Grid size={12}>
          <SubmitButton onClick={onFormSubmit} />
          <ResetButton onClick={resetForm} />
        </Grid>
        <Grid size={12}>
          <FormState
            formValues={formValues}
            errors={errors}
          />
        </Grid>
      </GridContainer>
    </FormContainer>
  );
}
