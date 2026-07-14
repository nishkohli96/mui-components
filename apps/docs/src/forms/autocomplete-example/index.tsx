'use client';

/**
 * MUIAutocomplete example — integrated with TanStack Form. Shows a single
 * free-solo select (stores a `string`) and a multi-select (stores a
 * `string[]`) with `limitTags`, `getLimitTagsText` and `ChipProps`, plus
 * `textFieldProps` and validation surfaced through `errorMessage`.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MUIAutocomplete from '@nish1896/mui-components/mui/autocomplete';
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

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Qwik'];
const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'Kotlin'];

type AutocompleteValues = {
  framework: string;
  languages: string[];
};

const initialValues: AutocompleteValues = {
  framework: '',
  languages: ['TypeScript']
};

export default function AutocompleteExampleForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await logFirebaseEvent(formSubmitEventName, { pathName });
      showToastMessage(value);
    }
  });

  return (
    <FormContainer title="MUIAutocomplete">
      <form
        onSubmit={event => {
          event.preventDefault();
          form.handleSubmit();
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
            <FieldVariantInfo title="Single free-solo select with validation" />
            <form.Field
              name="framework"
              validators={{
                onChange: ({ value }) => (!value ? 'Choose a framework' : undefined)
              }}
            >
              {field => (
                <MUIAutocomplete
                  fieldName="framework"
                  options={frameworks}
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange((newValue as string) ?? '')}
                  onBlur={field.handleBlur}
                  errorMessage={field.state.meta.errors}
                  freeSolo
                  required
                  textFieldProps={{ placeholder: 'Type or pick a framework' }}
                  disabled={disableAllFields}
                />
              )}
            </form.Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Multi-select with limitTags & chip props" />
            <form.Field
              name="languages"
              validators={{
                onChange: ({ value }) =>
                  (value.length === 0 ? 'Pick at least one language' : undefined)
              }}
            >
              {field => (
                <MUIAutocomplete
                  fieldName="languages"
                  options={languages}
                  value={field.state.value}
                  onValueChange={({ newValue }) => field.handleChange((newValue as string[]) ?? [])}
                  multiple
                  limitTags={2}
                  getLimitTagsText={more => `+${more} more`}
                  ChipProps={{ color: 'primary', size: 'small' }}
                  required
                  errorMessage={field.state.meta.errors}
                  disabled={disableAllFields}
                />
              )}
            </form.Field>
          </Grid>

          <form.Subscribe
            selector={state => ({
              values: state.values,
              fieldMeta: state.fieldMeta,
              canSubmit: state.canSubmit
            })}
          >
            {({ values, fieldMeta, canSubmit }) => {
              const errors = Object.fromEntries(
                Object.entries(fieldMeta).map(([name, meta]) => [name, meta?.errors?.[0]])
              );
              return (
                <>
                  <Grid size={12}>
                    <SubmitButton disabled={!canSubmit} />
                    <ResetButton onClick={() => form.reset()} />
                  </Grid>
                  <Grid size={12}>
                    <FormState formValues={values} errors={errors} />
                  </Grid>
                </>
              );
            }}
          </form.Subscribe>
        </GridContainer>
      </form>
    </FormContainer>
  );
}
