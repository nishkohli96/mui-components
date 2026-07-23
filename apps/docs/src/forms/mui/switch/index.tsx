'use client';

/**
 * MUISwitch example — driven by plain React `useState` (no form library) to
 * show the component's basic contract plus its extra props: custom `label`,
 * `formControlLabelProps`, pass-through MUI `SwitchProps` (color/size),
 * `helperText`, `errorMessage` + `renderError`, and `customIds`.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MUISwitch from '@nish1896/mui-components/mui/switch';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { useThemeContext } from '@/theme';
import { showToastMessage, logFirebaseEvent } from '@/utils';

const initialValues = {
  notifications: true,
  acceptTerms: false
};

export default function SwitchForm() {
  const pathName = usePathname();
  const { currentTheme, toggleTheme } = useThemeContext();

  const [notifications, setNotifications] = useState(initialValues.notifications);
  const [darkMode, setDarkMode] = useState(currentTheme === 'dark');
  const [acceptTerms, setAcceptTerms] = useState(initialValues.acceptTerms);
  const [acceptTermsError, setAcceptTermsError] = useState<string>();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const formValues = { notifications, darkMode, acceptTerms };
  const errors = { acceptTerms: acceptTermsError };

  function resetForm() {
    setNotifications(initialValues.notifications);
    setDarkMode(currentTheme === 'dark');
    setAcceptTerms(initialValues.acceptTerms);
    setAcceptTermsError(undefined);
  }

  async function onFormSubmit() {
    if (!acceptTerms) {
      setAcceptTermsError('You must accept the terms to continue');
      return;
    }
    setAcceptTermsError(undefined);
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer title="MUISwitch">
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

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Basic switch with a helper text" />
            <MUISwitch
              fieldName="notifications"
              value={notifications}
              onValueChange={({ newValue }) => setNotifications(newValue)}
              helperText="Receive product and security emails"
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Custom label, colour/size & label placement" />
            <MUISwitch
              fieldName="darkMode"
              label="Enable dark mode"
              value={darkMode}
              onValueChange={({ newValue }) => {
                toggleTheme();
                setDarkMode(newValue);
              }}
              color="secondary"
              size="medium"
              formControlLabelProps={{ labelPlacement: 'start' }}
              disabled={disableAllFields}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Required toggle with custom error render & ids" />
            <MUISwitch
              fieldName="acceptTerms"
              label="I accept the terms and conditions"
              value={acceptTerms}
              onValueChange={({ newValue }) => {
                setAcceptTerms(newValue);
                setAcceptTermsError(undefined);
              }}
              errorMessage={acceptTermsError}
              renderError={errors => (
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                  <Typography component="span" variant="body2">
                    {errors[0]}
                  </Typography>
                </Box>
              )}
              customIds={{
                field: 'acceptTerms',
                error: 'acceptTerms-error'
              }}
              disabled={disableAllFields}
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
