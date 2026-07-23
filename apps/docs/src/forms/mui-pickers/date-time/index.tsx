'use client';

/**
 * Date-Time Pickers example — plain React `useState`. Demonstrates all four
 * variants sharing the same controlled `value` / `onValueChange` contract:
 * responsive, desktop, mobile and static.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from 'dayjs';
import { ConfigProvider } from '@nish1896/mui-components/config';
import {
  MUIDateTimePicker,
  MUIDesktopDateTimePicker,
  MUIMobileDateTimePicker,
  MUIStaticDateTimePicker
} from '@nish1896/mui-components/mui-pickers/date-time';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { logFirebaseEvent, showToastMessage } from '@/utils';

type DateTimePickerValues = {
  appointment: Dayjs | null;
  desktopDateTime: Dayjs | null;
  mobileDateTime: Dayjs | null;
  staticDateTime: Dayjs | null;
};

const initialValues: DateTimePickerValues = {
  appointment: null,
  desktopDateTime: null,
  mobileDateTime: null,
  staticDateTime: null
};

export default function DateTimePickersForm() {
  const pathName = usePathname();
  const [values, setValues] = useState<DateTimePickerValues>(initialValues);
  const [appointmentError, setAppointmentError] = useState<string>();
  const [disableAllFields, setDisableAllFields] = useState(false);

  /*
   * MUI X types onValueChange's value as its adapter-agnostic `PickerValue`,
   * which doesn't structurally narrow to `Dayjs` even though `AdapterDayjs`
   * is configured below — cast once at this boundary.
   */
  function setField<K extends keyof DateTimePickerValues>(name: K, value: unknown) {
    setValues(prev => ({ ...prev, [name]: value as DateTimePickerValues[K] }));
  }

  function resetForm() {
    setValues(initialValues);
    setAppointmentError(undefined);
  }

  /** Converts Dayjs values to JSON-friendly strings for the toast/state readout. */
  function toDisplayValues(formValues: DateTimePickerValues) {
    return {
      appointment: formValues.appointment?.format('YYYY-MM-DD HH:mm') ?? null,
      desktopDateTime: formValues.desktopDateTime?.format('YYYY-MM-DD HH:mm') ?? null,
      mobileDateTime: formValues.mobileDateTime?.format('YYYY-MM-DD HH:mm') ?? null,
      staticDateTime: formValues.staticDateTime?.format('YYYY-MM-DD HH:mm') ?? null
    };
  }

  async function onFormSubmit() {
    if (!values.appointment) {
      setAppointmentError('Appointment date & time is required');
      return;
    }
    setAppointmentError(undefined);
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(toDisplayValues(values));
  }

  return (
    <FormContainer title="Date-Time Pickers">
      <ConfigProvider dateAdapter={AdapterDayjs}>
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
              <FieldVariantInfo title="MUIDateTimePicker — responsive, disablePast" />
              <MUIDateTimePicker
                fieldName="appointment"
                value={values.appointment}
                onValueChange={({ newValue }) => {
                  setField('appointment', newValue);
                  setAppointmentError(undefined);
                }}
                label="Appointment"
                disablePast
                ampm={false}
                showLabelAboveFormField
                required
                errorMessage={appointmentError}
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIDesktopDateTimePicker — always the keyboard-first UI" />
              <MUIDesktopDateTimePicker
                fieldName="desktopDateTime"
                value={values.desktopDateTime}
                onValueChange={({ newValue }) => setField('desktopDateTime', newValue)}
                label="Desktop Date-Time"
                ampm={false}
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIMobileDateTimePicker — always the modal UI" />
              <MUIMobileDateTimePicker
                fieldName="mobileDateTime"
                value={values.mobileDateTime}
                onValueChange={({ newValue }) => setField('mobileDateTime', newValue)}
                label="Mobile Date-Time"
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIStaticDateTimePicker — always-visible inline, no text field" />
              <MUIStaticDateTimePicker
                fieldName="staticDateTime"
                value={values.staticDateTime}
                onValueChange={({ newValue }) => setField('staticDateTime', newValue)}
                label="Static Date-Time"
                showLabelAboveFormField
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={12}>
              <SubmitButton disabled={disableAllFields} />
              <ResetButton onClick={resetForm} />
            </Grid>
            <Grid size={12}>
              <FormState formValues={toDisplayValues(values)} errors={{ appointment: appointmentError }} />
            </Grid>
          </GridContainer>
        </form>
      </ConfigProvider>
    </FormContainer>
  );
}
