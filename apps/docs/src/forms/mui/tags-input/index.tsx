'use client';

/**
 * MUITagsInput example — integrated with Formik to show tag interception and
 * rendering props alongside a real form library: `onTagAdd` (transform /
 * block), `onTagDelete` (lock a tag), `onTagPaste`, `delimiter`, `maxTags`,
 * `limitTags` + `getLimitTagsText`, `renderTagLabel` and `ChipProps`.
 *
 * Formik reports errors as `errors.<field>` strings; passing
 * `touched && errors` (or the submit-gated error) to `errorMessage` works
 * as-is — `false` simply clears the error state.
 */

import { useFormik } from 'formik';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import MUITagsInput from '@nish1896/mui-components/mui/tags-input';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { showToastMessage, logFirebaseEvent, formikError } from '@/utils';

type TagsFormValues = {
  skills: string[];
  keywords: string[];
};

const initialValues: TagsFormValues = {
  skills: [],
  keywords: ['react', 'mui']
};

export default function TagsInputForm() {
  const pathName = usePathname();

  const formik = useFormik<TagsFormValues>({
    initialValues,
    validate: values => {
      const errors: Partial<Record<keyof TagsFormValues, string>> = {};
      if (values.skills.length === 0) {
        errors.skills = 'Add at least one skill';
      }
      return errors;
    },
    onSubmit: async values => {
      await logFirebaseEvent(formSubmitEventName, { pathName });
      showToastMessage(values);
    }
  });

  return (
    <FormContainer title="MUITagsInput">
      <form onSubmit={formik.handleSubmit}>
        <GridContainer>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Max 5 tags, lowercased & de-duplicated on add" />
            <MUITagsInput
              fieldName="skills"
              value={formik.values.skills}
              onValueChange={({ newValue }) => formik.setFieldValue('skills', newValue)}
              onTagAdd={({ currentValue, newTag }) => {
                const tag = newTag.trim().toLowerCase();
                if (tag.length < 2) {
                  return false;
                }
                if (currentValue.includes(tag)) {
                  return false;
                }
                return tag;
              }}
              delimiter=","
              limitTags={3}
              maxTags={5}
              required
              errorMessage={formikError(formik.submitCount > 0 && formik.errors.skills)}
              helperText="Type a skill and press Enter or comma (max 5); maximum of 3 tags visible at once"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="custom delimiter, custom chip render & a locked tag" />
            <MUITagsInput
              fieldName="keywords"
              label="Keywords"
              value={formik.values.keywords}
              delimiter="|"
              onValueChange={({ newValue }) => formik.setFieldValue('keywords', newValue)}
              onTagDelete={({ deletedTag }) => deletedTag !== 'react'}
              onTagPaste={({ pastedTags }) => pastedTags.map(tag => tag.toLowerCase())}
              renderTagLabel={tag => `#${tag}`}
              ChipProps={{ color: 'primary', size: 'small', variant: 'outlined' }}
              getLimitTagsText={more => `+${more} more`}
              showLabelAboveFormField
              helperText="Paste is lowercased; '|' delimiter; the 'react' tag can't be removed"
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
                skills: formik.submitCount > 0 && typeof formik.errors.skills === 'string'
                  ? formik.errors.skills
                  : undefined
              }}
            />
          </Grid>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
