'use client';

/**
 * MUITipTapRte example — plain React `useState`. The value is an HTML
 * string emitted by Tiptap. Shows a required editor with a custom `label`
 * and validation, and a second editor with the label above the field.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import MUITipTapRte from '@nish1896/mui-components/misc/tiptap-rte';
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
import CustomToolbar from './CustomToolbar';

/**
 * Currently this package is in BETA.
 * `tiptap-markdown` doesn't ship this augmentation itself — declare it here
 * so `editor.storage.markdown` below is typed instead of falling to `any`
 */
declare module '@tiptap/core' {
  interface Storage {
    markdown: MarkdownStorage;
  }
}

/** Tiptap emits an empty document as "<p></p>" — treat it as blank. */
function isBlankHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim().length === 0;
}

const initialValues = {
  bio: '',
  notes: '',
  review: ''
};

/**
 * Trimmed extension set for the "custom" example below — no headings, lists,
 * blockquote or code block, so its toolbar only needs Bold/Italic/Underline —
 * plus `Markdown` (from `tiptap-markdown`) so the editor's content can also
 * be read back out as a markdown string via `editor.storage.markdown`.
 */
const reviewExtensions = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    codeBlock: false,
    bulletList: false,
    orderedList: false
  }),
  Underline,
  Markdown
];

export default function TipTapRteForm() {
  const pathName = usePathname();

  const [bio, setBio] = useState(initialValues.bio);
  const [bioError, setBioError] = useState<string>();
  const [notes, setNotes] = useState(initialValues.notes);
  const [review, setReview] = useState(initialValues.review);
  const [reviewMarkdown, setReviewMarkdown] = useState('');
  const [disableAllFields, setDisableAllFields] = useState(false);

  const formValues = { bio, notes, review };
  const errors = { bio: bioError };

  function resetForm() {
    setBio(initialValues.bio);
    setNotes(initialValues.notes);
    setReview(initialValues.review);
    setReviewMarkdown('');
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
          <Grid size={12}>
            <FieldVariantInfo title="Required editor with a custom label & validation" />
            <MUITipTapRte
              fieldName="bio"
              label={(
                <Typography color="primary">
                  Briefly describe yourself
                </Typography>
              )}
              value={bio}
              onValueChange={({ newValue }) => {
                setBio(newValue);
                setBioError(undefined);
              }}
              required
              disabled={disableAllFields}
              errorMessage={bioError}
            />
          </Grid>

          <Grid size={12}>
            <FieldVariantInfo title="Editor with the label above the field & helperText" />
            <MUITipTapRte
              fieldName="notes"
              label="Additional notes"
              value={notes}
              onValueChange={({ newValue }) => setNotes(newValue)}
              showLabelAboveFormField
              helperText="Optional — anything else we should know?"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={12}>
            <FieldVariantInfo title="Custom extensions, toolbar, markdown & style overrides" />
            <MUITipTapRte
              fieldName="review"
              label="Quick review"
              value={review}
              onValueChange={({ newValue }) => setReview(newValue)}
              disabled={disableAllFields}
              editorExtensions={reviewExtensions}
              editorOptions={{
                onCreate: ({ editor }) => setReviewMarkdown(editor.storage.markdown.getMarkdown()),
                onUpdate: ({ editor }) => setReviewMarkdown(editor.storage.markdown.getMarkdown())
              }}
              containerProps={{ sx: { borderColor: 'secondary.main', borderRadius: 2 } }}
              contentContainerProps={{ sx: { minHeight: 100, bgcolor: 'action.hover' } }}
              renderToolbar={(editor, disabled) => (
                <CustomToolbar editor={editor} disabled={disabled} />
              )}
            />
            {reviewMarkdown && (
              <Box
                component="pre"
                sx={{
                  mt: 1,
                  p: 1,
                  fontSize: 13,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  bgcolor: 'grey.100',
                  borderRadius: 1
                }}
              >
                {reviewMarkdown}
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Value above stays an HTML string — this preview reads
              {' '}
              <code>editor.storage.markdown.getMarkdown()</code>
              {' '}
              (from the
              {' '}
              <code>Markdown</code>
              {' '}
              extension) via
              {' '}
              <code>editorOptions.onCreate</code>
              /
              <code>onUpdate</code>
              .
            </Typography>
          </Grid>

          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={resetForm} />
          </Grid>
          <Grid size={12}>
            <FormState
              formValues={formValues}
              errors={errors}
            />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
