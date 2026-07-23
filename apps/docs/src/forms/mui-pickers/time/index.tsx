'use client';

/**
 * Time Pickers example — plain React `useState`. Demonstrates all four
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
  MUITimePicker,
  MUIDesktopTimePicker,
  MUIMobileTimePicker,
  MUIStaticTimePicker
} from '@nish1896/mui-components/mui-pickers/time';
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

type TimePickerValues = {
  arrivalTime: Dayjs | null;
  desktopTime: Dayjs | null;
  mobileTime: Dayjs | null;
  staticTime: Dayjs | null;
};

const initialValues: TimePickerValues = {
  arrivalTime: null,
  desktopTime: null,
  mobileTime: null,
  staticTime: null
};

export default function TimePickersForm() {
  const pathName = usePathname();
  const [values, setValues] = useState<TimePickerValues>(initialValues);
  const [arrivalTimeError, setArrivalTimeError] = useState<string>();
  const [disableAllFields, setDisableAllFields] = useState(false);

  /*
   * MUI X types onValueChange's value as its adapter-agnostic `PickerValue`,
   * which doesn't structurally narrow to `Dayjs` even though `AdapterDayjs`
   * is configured below — cast once at this boundary.
   */
  function setField<K extends keyof TimePickerValues>(name: K, value: unknown) {
    setValues(prev => ({ ...prev, [name]: value as TimePickerValues[K] }));
  }

  function resetForm() {
    setValues(initialValues);
    setArrivalTimeError(undefined);
  }

  /** Converts Dayjs values to JSON-friendly strings for the toast/state readout. */
  function toDisplayValues(formValues: TimePickerValues) {
    return {
      arrivalTime: formValues.arrivalTime?.format('HH:mm') ?? null,
      desktopTime: formValues.desktopTime?.format('HH:mm') ?? null,
      mobileTime: formValues.mobileTime?.format('HH:mm') ?? null,
      staticTime: formValues.staticTime?.format('HH:mm') ?? null
    };
  }

  async function onFormSubmit() {
    if (!values.arrivalTime) {
      setArrivalTimeError('Arrival Time is required');
      return;
    }
    setArrivalTimeError(undefined);
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(toDisplayValues(values));
  }

  return (
    <FormContainer title="Time Pickers">
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
              <FieldVariantInfo title="MUITimePicker — responsive, 24-hour format" />
              <MUITimePicker
                fieldName="arrivalTime"
                value={values.arrivalTime}
                onValueChange={({ newValue }) => {
                  setField('arrivalTime', newValue);
                  setArrivalTimeError(undefined);
                }}
                label="Arrival Time"
                ampm={false}
                showLabelAboveFormField
                required
                errorMessage={arrivalTimeError}
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIDesktopTimePicker — always the keyboard-first UI" />
              <MUIDesktopTimePicker
                fieldName="desktopTime"
                value={values.desktopTime}
                onValueChange={({ newValue }) => setField('desktopTime', newValue)}
                label="Desktop Time"
                minutesStep={15}
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIMobileTimePicker — always the modal UI" />
              <MUIMobileTimePicker
                fieldName="mobileTime"
                value={values.mobileTime}
                onValueChange={({ newValue }) => setField('mobileTime', newValue)}
                label="Mobile Time"
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldVariantInfo title="MUIStaticTimePicker — always-visible inline, no text field" />
              <MUIStaticTimePicker
                fieldName="staticTime"
                value={values.staticTime}
                onValueChange={({ newValue }) => setField('staticTime', newValue)}
                label="Static Time"
                showLabelAboveFormField
                disabled={disableAllFields}
              />
            </Grid>

            <Grid size={12}>
              <SubmitButton disabled={disableAllFields} />
              <ResetButton onClick={resetForm} />
            </Grid>
            <Grid size={12}>
              <FormState formValues={toDisplayValues(values)} errors={{ arrivalTime: arrivalTimeError }} />
            </Grid>
          </GridContainer>
        </form>
      </ConfigProvider>
    </FormContainer>
  );
}
