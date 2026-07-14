'use client';

/**
 * MUIRichTextEditor example — plain React `useState`. The value is an HTML
 * string emitted by CKEditor. Shows a required editor with a custom `label`
 * and validation, and a second editor with the label above the field.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MUIRichTextEditor from '@nish1896/mui-components/misc/rich-text-editor';
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

/** CKEditor emits an empty document as "<p>&nbsp;</p>" or "" — treat both as blank. */
function isBlankHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length === 0;
}

const initialValues = {
  bio: '',
  notes: ''
};

export default function RichTextEditorForm() {
  const pathName = usePathname();

  const [bio, setBio] = useState(initialValues.bio);
  const [bioError, setBioError] = useState<string>();
  const [notes, setNotes] = useState(initialValues.notes);

  const formValues = { bio, notes };
  const errors = { bio: bioError };

  function resetForm() {
    setBio(initialValues.bio);
    setNotes(initialValues.notes);
    setBioError(undefined);
  }

  async function onFormSubmit() {
    if (isBlankHtml(bio)) {
      setBioError('Please add a short bio');
      return;
    }
    setBioError(undefined);
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer title="MUIRichTextEditor">
      <form
        onSubmit={event => {
          event.preventDefault();
          onFormSubmit();
        }}
      >
        <GridContainer>
          <Grid size={12}>
            <FieldVariantInfo title="Required editor with a custom label & validation" />
            <MUIRichTextEditor
              fieldName="bio"
              label={<Typography color="primary">Briefly describe yourself</Typography>}
              value={bio}
              onValueChange={({ newValue }) => {
                setBio(newValue);
                setBioError(undefined);
              }}
              required
              errorMessage={bioError}
            />
          </Grid>

          <Grid size={12}>
            <FieldVariantInfo title="Editor with the label above the field" />
            <MUIRichTextEditor
              fieldName="notes"
              label="Additional notes"
              value={notes}
              onValueChange={({ newValue }) => setNotes(newValue)}
              showLabelAboveFormField
              helperText="Optional — anything else we should know?"
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
