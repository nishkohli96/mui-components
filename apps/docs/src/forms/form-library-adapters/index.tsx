'use client';

/**
 * Live proof that @nish1896/mui-components — controlled via
 * `value` / `onValueChange` / `errorMessage` — drops into any form library.
 *
 * Two self-contained examples in one file:
 *   1. TanStack Form  (@tanstack/react-form)
 *   2. Formik         (formik)
 *
 * The single integration detail worth noting: the components key their error
 * STATE off `!!errorMessage` and render it as text, so a library's error must
 * be reduced to a plain string before it is passed in. Both examples below do
 * that (see the `errorMessage=` lines). With a schema adapter (Zod/Yup/Valibot)
 * whose errors are objects, map them first, e.g. `errors[0]?.message`.
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
import MUISelect from '@nish1896/mui-components/mui/select';
import MUICheckbox from '@nish1896/mui-components/mui/checkbox';
import MUISwitch from '@nish1896/mui-components/mui/switch';

const roleOptions = ['Admin', 'Editor', 'Viewer'];
const emailPattern
  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredMsg = (label: string) => `${label} is required`;

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
              /* reduce the library's error[] to a plain string */
              errorMessage={field.state.meta.errors[0] as string | undefined}
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
              errorMessage={field.state.meta.errors[0] as string | undefined}
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
              errorMessage={field.state.meta.errors[0] as string | undefined}
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
          errorMessage={
            formik.touched.fullName ? formik.errors.fullName : undefined
          }
        />

        <MUINumberInput
          fieldName="age"
          value={formik.values.age}
          onValueChange={({ newValue }) =>
            formik.setFieldValue('age', newValue)}
          onBlur={() => formik.setFieldTouched('age', true)}
          errorMessage={formik.touched.age ? formik.errors.age : undefined}
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
          Driven by <code>field.state.value</code> /{' '}
          <code>field.handleChange</code>, with{' '}
          <code>field.state.meta.errors[0]</code> as the error string.
        </Typography>
        <TanStackExample />
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Formik
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Driven by <code>formik.values</code> /{' '}
          <code>setFieldValue</code>, with{' '}
          <code>touched &amp;&amp; errors</code> as the error string.
        </Typography>
        <FormikExample />
      </Box>
    </Stack>
  );
}
