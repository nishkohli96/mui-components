'use client';

/**
 * Live proof that @nish1896/mui-components — controlled via
 * `value` / `onValueChange` / `errorMessage` — drops into any form library.
 *
 * Two self-contained examples in one file:
 *   1. TanStack Form  (@tanstack/react-form)
 *   2. Formik         (formik)
 *
 * Every field takes `errorMessage` as `string | string[]`. Each library
 * reports errors in its own shape — TanStack's `meta.errors` is an array that
 * may nest, Formik's `touched && errors` is `string | false` — so a one-line
 * adapter per library (`tanstackErrors` / `formikError` below) normalizes them
 * to that at the boundary. When a validator reports several failed rules at
 * once (the password field below), every message renders together, and
 * `renderError={errors => ...}` can restyle them.
 */

import { useForm } from '@tanstack/react-form';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MUITextField from '@nish1896/mui-components/mui/textfield';
import MUINumberInput from '@nish1896/mui-components/mui/number-input';
import MUIPasswordInput from '@nish1896/mui-components/mui/password-input';
import MUISelect from '@nish1896/mui-components/mui/select';
import MUICheckbox from '@nish1896/mui-components/mui/checkbox';
import MUISwitch from '@nish1896/mui-components/mui/switch';

const roleOptions = ['Admin', 'Editor', 'Viewer'];
const emailPattern
  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredMsg = (label: string) => `${label} is required`;

/* Adapters that normalize each library's native error shape to the
   `string | string[]` every mui-components field accepts. `tanstackErrors`
   flattens one level so a field reporting several rules at once — where
   `meta.errors` is `[[ruleA, ruleB]]` — surfaces every message. */
const tanstackErrors = (errors: unknown[]): string[] =>
  errors.flat().filter((error): error is string => typeof error === 'string');

const formikError = (error: string | false | undefined): string | undefined =>
  error || undefined;

/* Collects every failed password rule — returned as a string[] so all
   failures surface in `errorMessage` together. */
const passwordRuleFailures = (value: string): string[] | undefined => {
  const failures = [
    value.length < 8 && 'Use at least 8 characters',
    !(/[A-Z]/).test(value) && 'Add an uppercase letter',
    !(/[^A-Za-z0-9]/).test(value) && 'Add a special character'
  ].filter((rule): rule is string => typeof rule === 'string');
  return failures.length > 0 ? failures : undefined;
};

/* A tiny JSON readout so each demo shows its live values + errors. */
const StateReadout = ({ data }: { data: unknown }) => (
  <Paper
    variant="outlined"
    sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}
  >
    <Typography
      component="pre"
      sx={{ m: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', overflowX: 'auto' }}
    >
      {JSON.stringify(data, null, 2)}
    </Typography>
  </Paper>
);

/* ---------------------------------------------------------------------- */
/* 1. TanStack Form                                                        */
/* ---------------------------------------------------------------------- */

function TanStackExample() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      password: '',
      role: '',
      terms: false
    },
    onSubmit: ({ value }) => {
      window.alert(`TanStack submit:\n${JSON.stringify(value, null, 2)}`);
    }
  });

  return (
    <Box
      component="form"
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Stack spacing={2.5}>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) =>
              (!value ? requiredMsg('First name') : undefined)
          }}
        >
          {field => (
            <MUITextField
              fieldName="firstName"
              value={field.state.value}
              onValueChange={({ newValue }) => field.handleChange(newValue)}
              onBlur={field.handleBlur}
              errorMessage={tanstackErrors(field.state.meta.errors)}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => passwordRuleFailures(value)
          }}
        >
          {field => (
            <MUIPasswordInput
              fieldName="password"
              value={field.state.value}
              onValueChange={({ newValue }) => field.handleChange(newValue)}
              onBlur={field.handleBlur}
              /* several failed rules at once: meta.errors is [ [ruleA, ruleB] ]
                 — tanstackErrors flattens it so every message is kept */
              errorMessage={tanstackErrors(field.state.meta.errors)}
              renderError={errors => (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {errors.map(error => (
                    <li key={error}>
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            />
          )}
        </form.Field>

        <form.Field
          name="role"
          validators={{
            onChange: ({ value }) =>
              (!value ? requiredMsg('Role') : undefined)
          }}
        >
          {field => (
            <MUISelect
              fieldName="role"
              options={roleOptions}
              value={field.state.value}
              onValueChange={({ newValue }) => field.handleChange(newValue)}
              onBlur={field.handleBlur}
              errorMessage={tanstackErrors(field.state.meta.errors)}
              showDefaultOption
            />
          )}
        </form.Field>

        <form.Field
          name="terms"
          validators={{
            onChange: ({ value }) =>
              (!value ? 'You must accept the terms' : undefined)
          }}
        >
          {field => (
            <MUICheckbox
              fieldName="terms"
              label="I accept the terms and conditions"
              value={field.state.value}
              onValueChange={({ newValue }) => field.handleChange(newValue)}
              errorMessage={tanstackErrors(field.state.meta.errors)}
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={state => ({
            values: state.values,
            canSubmit: state.canSubmit,
            isDirty: state.isDirty
          })}
        >
          {({ values, canSubmit }) => (
            <Box>
              <Button type="submit" variant="contained" disabled={!canSubmit}>
                Submit
              </Button>
              <StateReadout data={values} />
            </Box>
          )}
        </form.Subscribe>
      </Stack>
    </Box>
  );
}

/* ---------------------------------------------------------------------- */
/* 2. Formik                                                               */
/* ---------------------------------------------------------------------- */

type FormikValues = {
  fullName: string;
  age: number | null;
  notifications: boolean;
};

function FormikExample() {
  const formik = useFormik<FormikValues>({
    initialValues: {
      fullName: '',
      age: null,
      notifications: false
    },
    validate: values => {
      const errors: Partial<Record<keyof FormikValues, string>> = {};
      if (!values.fullName) {
        errors.fullName = requiredMsg('Full name');
      } else if (!emailPattern.test(values.fullName) && values.fullName.length < 3) {
        errors.fullName = 'Enter at least 3 characters';
      }
      if (values.age !== null && values.age < 18) {
        errors.age = 'Must be 18 or older';
      }
      return errors;
    },
    onSubmit: values => {
      window.alert(`Formik submit:\n${JSON.stringify(values, null, 2)}`);
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={2.5}>
        <MUITextField
          fieldName="fullName"
          value={formik.values.fullName}
          onValueChange={({ newValue }) =>
            formik.setFieldValue('fullName', newValue)}
          onBlur={() => formik.setFieldTouched('fullName', true)}
          errorMessage={formikError(formik.touched.fullName && formik.errors.fullName)}
        />

        <MUINumberInput
          fieldName="age"
          value={formik.values.age}
          onValueChange={({ newValue }) =>
            formik.setFieldValue('age', newValue)}
          onBlur={() => formik.setFieldTouched('age', true)}
          errorMessage={formikError(formik.touched.age && formik.errors.age)}
          onlyIntegers
          nonNegative
        />

        <MUISwitch
          fieldName="notifications"
          label="Email notifications"
          value={formik.values.notifications}
          onValueChange={({ newValue }) =>
            formik.setFieldValue('notifications', newValue)}
        />

        <Box>
          <Button type="submit" variant="contained">
            Submit
          </Button>
          <StateReadout data={formik.values} />
        </Box>
      </Stack>
    </Box>
  );
}

/* ---------------------------------------------------------------------- */
/* Combined demo                                                           */
/* ---------------------------------------------------------------------- */

export default function FormLibraryAdapters() {
  return (
    <Stack spacing={4} sx={{ my: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          TanStack Form
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Driven by
          {' '}
          <code>field.state.value</code>
          {' '}
          /
          {' '}
          <code>field.handleChange</code>
          , with
          {' '}
          <code>errorMessage=&#123;tanstackErrors(field.state.meta.errors)&#125;</code>
          {' '}
          — a one-line adapter that flattens
          {' '}
          <code>meta.errors</code>
          {' '}
          to
          {' '}
          <code>string[]</code>
          , so the password field surfaces several failed rules at once via
          {' '}
          <code>renderError</code>
          .
        </Typography>
        <TanStackExample />
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Formik
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Driven by
          {' '}
          <code>formik.values</code>
          {' '}
          /
          {' '}
          <code>setFieldValue</code>
          , with
          {' '}
          <code>errorMessage=&#123;formikError(touched &amp;&amp; errors)&#125;</code>
          {' '}
          — a one-line adapter that maps Formik&apos;s
          {' '}
          <code>string | false</code>
          {' '}
          to
          {' '}
          <code>string | undefined</code>
          .
        </Typography>
        <FormikExample />
      </Box>
    </Stack>
  );
}
