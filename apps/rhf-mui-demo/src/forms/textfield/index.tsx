'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MUITextField from '@nish1896/mui-components/mui/textfield';
import { toast } from 'react-toastify';
import {
  FormContainer,
  GridContainer,
  FieldVariantInfo,
  FormState,
  SubmitButton,
  ResetButton,
  UploadedFile,
  UploadedImage
} from '@/components';
import { formSubmitEventName } from '@/constants';
import { OptionalString, NullishOptionalString } from '@/types';
import { reqdMsg, minCharMsg, maxCharMsg, showToastMessage, logFirebaseEvent } from '@/utils';

const emailPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const initialValues = {
	firstName: undefined,
  lastName: 'J',
	email: ''
}

export default function TextFieldForm() {
  const pathName = usePathname();

  const [firstName, setFirstName] = useState<OptionalString>(initialValues.firstName);
  const [lastName, setLastName] = useState<OptionalString>(initialValues.lastName);
  const [email, setEmail] = useState<OptionalString>(initialValues.email);
  const [emailError, setEmailError] = useState<NullishOptionalString>();
  const [disableAllFields, setDisableAllFields] = useState(false);

  const formValues = {
    firstName,
    lastName,
    email
  };

	const errors = {
		email: emailError
	}

	function resetForm() {
		setFirstName(initialValues.firstName);
		setLastName(initialValues.lastName);
		setEmail(initialValues.email);
	}

  async function onFormSubmit() {
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

	return (
		<FormContainer title="MUITextField">
			<form onSubmit={onFormSubmit}>
				<GridContainer>
					<Grid size={12}>
						<FormControlLabel
							control={(
								<Checkbox
									checked={disableAllFields}
									onChange={event => {
										setDisableAllFields(event.target.checked);
									}}
								/>
							)}
							label="Disable all fields"
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<FieldVariantInfo title="Basic Input field with required validation and customOnChange" />
						<MUITextField
							fieldName="firstName"
							value={firstName}
							onValueChange={({ newValue }) => {
								setFirstName(newValue);
							}}
							disabled={disableAllFields}
							required
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<FieldVariantInfo title="Input with min & max length validation and renderError" />
						<MUITextField
							fieldName="lastName"
							value={lastName}
							onValueChange={({ newValue }) => {
								setLastName(newValue.toUpperCase());
							}}
							disabled={disableAllFields}
							helperText="Enter min 4 and max 10 characters"
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<FieldVariantInfo title="Input with pattern validation & label above form-field with custom ids" />
						<MUITextField
							fieldName="email"
							value={email}
							onValueChange={({ newValue }) => {
								setEmail(newValue);
								setEmailError(undefined);
							}}
							onBlur={() => {
								setEmailError(
									email && !emailPattern.test(email)
										? 'Enter a valid email address'
										: undefined
								);
							}}
							errorMessage={emailError}
							renderError={error => (
								<Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
									<ErrorOutlineIcon color="error" fontSize="small" />
									<Typography component="span" variant="body2">
										{error}
									</Typography>
								</Box>
							)}
							customIds={{
								field: 'userEmail',
								label: 'userEmail-label',
								error: 'userEmail-error'
							}}
							variant="standard"
							showLabelAboveFormField
							formLabelProps={{ sx: { color: 'blue', fontWeight: 600 } }}
						/>
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
