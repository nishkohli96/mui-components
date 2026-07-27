'use client';

/**
 * Complete form covering every component, integrated with TanStack Form and
 * validated by a Joi schema (see `schema.ts`). The form-level validator returns
 * `{ fields }`, so each field's `meta.errors` — passed to `errorMessage` — is
 * driven by Joi. Includes a "disable all fields" toggle, submit and reset
 * buttons, and a live form-state readout.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ConfigProvider } from '@nish1896/mui-components/config';
import MUITextField from '@nish1896/mui-components/mui/textfield';
import MUIPasswordInput from '@nish1896/mui-components/mui/password-input';
import MUINumberInput from '@nish1896/mui-components/mui/number-input';
import MUITagsInput from '@nish1896/mui-components/mui/tags-input';
import MUIFileUploader from '@nish1896/mui-components/mui/file-uploader';
import MUISelect from '@nish1896/mui-components/mui/select';
import MUINativeSelect from '@nish1896/mui-components/mui/native-select';
import MUIAutocomplete from '@nish1896/mui-components/mui/autocomplete';
import MUIAutocompleteObject from '@nish1896/mui-components/mui/autocomplete-object';
import MUIMultiAutocomplete from '@nish1896/mui-components/mui/multi-autocomplete';
import MUIMultiAutocompleteObject from '@nish1896/mui-components/mui/multi-autocomplete-object';
import MUICountrySelect, {
  type CountryDetails
} from '@nish1896/mui-components/mui/country-select';
import MUICheckbox from '@nish1896/mui-components/mui/checkbox';
import MUICheckboxGroup from '@nish1896/mui-components/mui/checkbox-group';
import MUIRadioGroup from '@nish1896/mui-components/mui/radio-group';
import MUISwitch from '@nish1896/mui-components/mui/switch';
import MUISlider from '@nish1896/mui-components/mui/slider';
import MUIRating from '@nish1896/mui-components/mui/rating';
import { MUIDatePicker } from '@nish1896/mui-components/mui-pickers/date';
import { MUITimePicker } from '@nish1896/mui-components/mui-pickers/time';
import { MUIDateTimePicker } from '@nish1896/mui-components/mui-pickers/date-time';
import MUIColorPicker from '@nish1896/mui-components/misc/color-picker';
import MUIPhoneInput from '@nish1896/mui-components/misc/phone-input';
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
import { showToastMessage, logFirebaseEvent, tanstackErrors } from '@/utils';
import {
  type CityOption,
  roleOptions,
  priorityOptions,
  frameworkOptions,
  skillOptions,
  hobbyOptions,
  contactOptions,
  cityOptions,
  preferredCountries,
  initialValues,
  toDisplayValues
} from '../data';
import { validateWithJoi } from '../schema';

export default function CompleteTanStackForm() {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onChange: ({ value }) => validateWithJoi(value),
      onSubmit: ({ value }) => validateWithJoi(value)
    },
    onSubmit: async ({ value }) => {
      await logFirebaseEvent(formSubmitEventName, { pathName });
      showToastMessage(toDisplayValues(value));
    }
  });

  return (
    <FormContainer title="Complete Form — TanStack + Joi">
      <ConfigProvider dateAdapter={AdapterDayjs} allLabelsAboveFields>
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
              <FieldVariantInfo title="TextField" />
              <form.Field name="firstName">
                {field => (
                  <MUITextField
                    fieldName="firstName"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    onBlur={field.handleBlur}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="PasswordInput" />
              <form.Field name="password">
                {field => (
                  <MUIPasswordInput
                    fieldName="password"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    onBlur={field.handleBlur}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="NumberInput" />
              <form.Field name="age">
                {field => (
                  <MUINumberInput
                    fieldName="age"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    onBlur={field.handleBlur}
                    onlyIntegers
                    nonNegative
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="TagsInput" />
              <form.Field name="tags">
                {field => (
                  <MUITagsInput
                    fieldName="tags"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    maxTags={5}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="FileUploader" />
              <form.Field name="avatar">
                {field => (
                  <MUIFileUploader
                    fieldName="avatar"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as File | null)}
                    accept="image/*"
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="Select" />
              <form.Field name="role">
                {field => (
                  <MUISelect
                    fieldName="role"
                    options={roleOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as string)}
                    showDefaultOption
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="NativeSelect" />
              <form.Field name="priority">
                {field => (
                  <MUINativeSelect
                    fieldName="priority"
                    options={priorityOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as string)}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="Autocomplete" />
              <form.Field name="framework">
                {field => (
                  <MUIAutocomplete
                    fieldName="framework"
                    options={frameworkOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange((newValue as string) ?? '')}
                    onBlur={field.handleBlur}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="AutocompleteObject" />
              <form.Field name="city">
                {field => (
                  <MUIAutocompleteObject<CityOption>
                    fieldName="city"
                    options={cityOptions}
                    labelKey="name"
                    valueKey="id"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MultiAutocomplete" />
              <form.Field name="skills">
                {field => (
                  <MUIMultiAutocomplete
                    fieldName="skills"
                    options={skillOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    limitTags={2}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MultiAutocompleteObject" />
              <form.Field name="visitedCities">
                {field => (
                  <MUIMultiAutocompleteObject<CityOption>
                    fieldName="visitedCities"
                    options={cityOptions}
                    labelKey="name"
                    valueKey="id"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    limitTags={2}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="CountrySelect" />
              <form.Field name="country">
                {field => (
                  <MUICountrySelect
                    fieldName="country"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as CountryDetails | null)}
                    preferredCountries={preferredCountries}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="RadioGroup" />
              <form.Field name="contact">
                {field => (
                  <MUIRadioGroup
                    fieldName="contact"
                    options={contactOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as string)}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="CheckboxGroup" />
              <form.Field name="hobbies">
                {field => (
                  <MUICheckboxGroup
                    fieldName="hobbies"
                    options={hobbyOptions}
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as string[])}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="Slider & Rating" />
              <form.Field name="volume">
                {field => (
                  <MUISlider
                    fieldName="volume"
                    label="Volume"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as number)}
                    valueLabelDisplay="auto"
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
              <form.Field name="rating">
                {field => (
                  <MUIRating
                    fieldName="rating"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="Checkbox & Switch" />
              <form.Field name="subscribe">
                {field => (
                  <MUICheckbox
                    fieldName="subscribe"
                    label="Subscribe to the newsletter"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
              <form.Field name="notifications">
                {field => (
                  <MUISwitch
                    fieldName="notifications"
                    label="Enable notifications"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FieldVariantInfo title="DatePicker" />
              <form.Field name="dob">
                {field => (
                  <MUIDatePicker
                    fieldName="dob"
                    label="Date of birth"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as Dayjs | null)}
                    disableFuture
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FieldVariantInfo title="TimePicker" />
              <form.Field name="meetingTime">
                {field => (
                  <MUITimePicker
                    fieldName="meetingTime"
                    label="Meeting time"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as Dayjs | null)}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FieldVariantInfo title="DateTimePicker" />
              <form.Field name="appointment">
                {field => (
                  <MUIDateTimePicker
                    fieldName="appointment"
                    label="Appointment"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue as Dayjs | null)}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="ColorPicker" />
              <form.Field name="brandColor">
                {field => (
                  <MUIColorPicker
                    fieldName="brandColor"
                    label="Brand colour"
                    value={field.state.value}
                    onValueChange={({ colorValue, color, setColor }) => {
                      setColor(color);
                      field.handleChange(colorValue);
                    }}
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="PhoneInput" />
              <form.Field name="phone">
                {field => (
                  <MUIPhoneInput
                    fieldName="phone"
                    label="Phone"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    phoneInputProps={{ defaultCountry: 'us' }}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                    disabled={disableAllFields}
                  />
                )}
              </form.Field>
            </Grid>

            <Grid size={12}>
              <FieldVariantInfo title="RichTextEditor" />
              <form.Field name="bio">
                {field => (
                  <MUIRichTextEditor
                    fieldName="bio"
                    label="Short bio"
                    value={field.state.value}
                    onValueChange={({ newValue }) => field.handleChange(newValue)}
                    errorMessage={tanstackErrors(field.state.meta.errors)}
                    required
                  />
                )}
              </form.Field>
            </Grid>

            <form.Subscribe
              selector={state => ({
                values: state.values,
                fieldMeta: state.fieldMeta
              })}
            >
              {({ values, fieldMeta }) => {
                const errors = Object.fromEntries(
                  Object.entries(fieldMeta).map(([name, meta]) => [name, meta?.errors?.[0]])
                );
                return (
                  <>
                    <Grid size={12}>
                      <SubmitButton disabled={disableAllFields} />
                      <ResetButton
                        onClick={() => form.reset()}
                        disabled={disableAllFields}
                      />
                    </Grid>
                    <Grid size={12}>
                      <FormState
                        formValues={toDisplayValues(values)}
                        errors={errors}
                      />
                    </Grid>
                  </>
                );
              }}
            </form.Subscribe>
          </GridContainer>
        </form>
      </ConfigProvider>
    </FormContainer>
  );
}
