'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import MUITextField from '@nish1896/mui-components/mui/textfield';
import MUINumberInput from '@nish1896/mui-components/mui/number-input';
import MUIPasswordInput from '@nish1896/mui-components/mui/password-input';
import RHFTagsInput from '@nish1896/mui-components/mui/tags-input';
import RHFFileUploader from '@nish1896/mui-components/mui/file-uploader';
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
import {
  reqdMsg,
  minCharMsg,
  maxCharMsg,
  showToastMessage,
  logFirebaseEvent
} from '@/utils';

type FormSchema = {
  age?: number;
  weight?: number;
  balance?: number;
  tags?: string[];
  keywords?: string[];
  resume?: File;
  pictures?: File[];
  documents?: File[];
};

const initialValues: FormSchema = {
  keywords: ['hello', 'world', 'foo', 'bar', 'lorem ipsum']
};

const weightStepAmount = 2;
const balanceStepAmount = 0.5;
const emailPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const InputsWithRegisterForm = () => {
  const pathName = usePathname();
  const [disableAllFields, setDisableAllFields] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('J');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<string>();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm<FormSchema>({
    defaultValues: initialValues,
    disabled: disableAllFields
  });
  const watchedFormValues = useWatch({ control });
  const formValues = {
    ...watchedFormValues,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    age,
    weight,
    balance
  };

  async function onFormSubmit(formValues: FormSchema) {
    await logFirebaseEvent(formSubmitEventName, { pathName });
    showToastMessage(formValues);
  }

  return (
    <FormContainer title="Inputs">
      <form onSubmit={handleSubmit(onFormSubmit)}>
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
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Simple Password Field with hidden label" />
            <MUIPasswordInput
              fieldName="password"
              value={password}
              onValueChange={({ newValue }) => {
                setPassword(newValue);
                setPasswordError(undefined);
              }}
              onBlur={() => {
                if (!password) {
                  setPasswordError(reqdMsg('Password'));
                } else if (password.length < 4) {
                  setPasswordError(minCharMsg(4));
                } else {
                  setPasswordError(undefined);
                }
              }}
              errorMessage={passwordError}
              placeholder="Enter a secure password"
              hideLabel
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Password Field with custom icons & validate rule" />
            <MUIPasswordInput
              fieldName="confirmPassword"
              value={confirmPassword}
              onValueChange={({ newValue }) => {
                setConfirmPassword(newValue);
                setConfirmPasswordError(undefined);
              }}
              onBlur={() => {
                if (!confirmPassword) {
                  setConfirmPasswordError(reqdMsg('your password again'));
                } else if (confirmPassword.length < 4) {
                  setConfirmPasswordError(minCharMsg(4));
                } else if (confirmPassword !== password) {
                  setConfirmPasswordError('Passwords do not match');
                } else {
                  setConfirmPasswordError(undefined);
                }
              }}
              errorMessage={confirmPasswordError}
              variant="filled"
              showPasswordIcon={<VisibilityOffTwoToneIcon />}
              hidePasswordIcon={<VisibilityTwoToneIcon />}
              showLabelAboveFormField
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Number Input with integer value & Typography as a helper text" />
            <MUINumberInput
              fieldName="age"
              value={age}
              onValueChange={({ newValue }) => {
                setAge(newValue);
              }}
              variant="filled"
              placeholder="What is your age?"
              nonNegative
              onlyIntegers
              onFocus={e => e.target.select()}
              helperText={<Typography color="seagreen">Optional</Typography>}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Number Input with decimal place limit and integer stepAmount" />
            <MUINumberInput
              fieldName="weight"
              value={weight}
              onValueChange={({ newValue }) => {
                setWeight(newValue);
              }}
              maxDecimalPlaces={3}
              placeholder="Enter your weight"
              stepAmount={weightStepAmount}
              showMarkers
              nonNegative
              helperText={
                <Typography color="seagreen">
                  {`Press Arrow Up/Down keys to update input value by ${weightStepAmount}; negative
                  values are not allowed`}
                </Typography>
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  )
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Number Input with 2 decimal places and stepAmount" />
            <MUINumberInput
              fieldName="balance"
              value={balance}
              onValueChange={({ newValue }) => {
                setBalance(newValue);
                setBalanceError(undefined);
              }}
              onBlur={() => {
                setBalanceError(
                  balance === null ? reqdMsg('balance') : undefined
                );
              }}
              errorMessage={balanceError}
              required
              variant="filled"
              maxDecimalPlaces={2}
              stepAmount={balanceStepAmount}
              showMarkers
              helperText={
                <Typography color="seagreen">
                  {`Press Arrow Up/Down keys to update input value by ${balanceStepAmount}`}
                </Typography>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Tags Input with upto 4 visible tags, and custom onTagAdd, onTagDelete and onTagPaste events" />
            <RHFTagsInput
              fieldName="tags"
              control={control}
              registerOptions={{
                required: {
                  value: true,
                  message: reqdMsg('tags')
                }
              }}
              onTagAdd={({ newTag }) => {
                if (newTag.length < 3) {
                  return false;
                }
                if (newTag.toLowerCase().includes('sh')) {
                  return false;
                }
              }}
              onTagDelete={({ deletedTag }) => {
                if (deletedTag.length === 4) {
                  return false;
                }
              }}
              onTagPaste={({ pastedTags }) => {
                const filteredTags = pastedTags.filter(
                  t => t.length >= 3 && !t.toLowerCase().includes('sh')
                );
                return filteredTags;
              }}
              getLimitTagsText={moreTags => (
                <Typography color="green">
                  {`& ${moreTags} More`}
                </Typography>
              )}
              required
              helperText="Enter min 3 characters; no 'sh' substring allowed"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Tags Input with styled chips, custom delimiter and all tags visible" />
            <RHFTagsInput
              fieldName="keywords"
              control={control}
              registerOptions={{
                required: {
                  value: true,
                  message: reqdMsg('keywords')
                }
              }}
              ChipProps={{
                variant: 'outlined',
                sx: {
                  color: 'white',
                  variant: 'filled',
                  backgroundColor: theme => theme.palette.secondary.main
                }
              }}
              delimiter="|"
              variant="filled"
              showLabelAboveFormField
              maxTags={8}
              limitTags={-1}
              required
              helperText="Use '|' to separate tags; max 8 tags allowed"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Customized label and allow upload of at max 3 pdf files only; drag and drop disabled" />
            <RHFFileUploader
              fieldName="documents"
              control={control}
              accept=".pdf"
              multiple
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUploadIcon />
                  <Typography color="secondary" sx={{ fontWeight: 600 }}>
                    Upload Documents (PDFs only)
                  </Typography>
                </Box>
              }
              existingFiles={[
                {
                  name: 'SampleDocument.pdf',
                  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                }
              ]}
              existingFileListProps={{
                sx: {
                  mt: '10px',
                  p: '4px',
                  background: '#abcded',
                  borderRadius: '8px'
                }
              }}
              uploadedFileListProps={{
                sx: {
                  mt: '10px',
                  p: '4px',
                  background: '#4c4c4c',
                  borderRadius: '8px'
                }
              }}
              renderExistingFileItem={({ file }) => (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white decoration-blue-500 underline decoration-2 underline-offset-2"
                >
                  {file.name}
                </a>
              )}
              renderFileItem={({ file, removeFile }) => (
                <UploadedFile file={file} onRemove={removeFile} />
              )}
              onUploadError={errors => {
                toast.error(`${errors.length} file(s) were rejected`);
              }}
              fullWidth
              disableDragAndDrop
              maxFiles={3}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="Upload multiple images showing, with renderFileItem function. customOnChange function prevents upload if total files exceed the specified file limit" />
            <RHFFileUploader
              fieldName="pictures"
              control={control}
              accept="image/*"
              label="Upload Pictures"
              multiple
              fullWidth
              uploadedFileListProps={{
                sx: {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px 16px',
                  mt: 1
                }
              }}
              renderFileItem={({ file, removeFile }) => (
                <UploadedImage file={file} onRemove={removeFile} />
              )}
              onUploadError={errors => {
                toast.error(
                  `${
                    new Set(errors.map(({ file }) => file)).size
                  } file(s) were rejected as ${errors
                    .flatMap(({ errors: fileErrors }) => fileErrors)
                    .join(' ,')}`
                );
                console.log('errors: ', errors);
              }}
              customOnChange={({ rhfOnChange, newValue }) => {
                let files: File[] = [];
                if (Array.isArray(newValue)) {
                  files = newValue;
                } else if (newValue) {
                  files = [newValue];
                }
                const totalSize = files.reduce(
                  (sum, file) => sum + file.size,
                  0
                );
                if (totalSize > 20 * 1024 * 1024) {
                  toast.error('Total file size cannot exceed 20 MB');
                  return;
                }
                rhfOnChange(newValue);
              }}
              helperText="If sum of sizes of files exceed 20 MB, further uploads will not be permitted"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldVariantInfo title="FileUploader with custom button and customized dropzone style" />
            <RHFFileUploader
              fieldName="resume"
              control={control}
              label="Upload Resume"
              showLabelAboveFormField
              accept="application/pdf"
              renderUploadButton={fileInput => (
                <div style={{ width: '200px' }}>
                  <IconButton component="label" tabIndex={-1}>
                    <UploadFileIcon />
                    {fileInput}
                  </IconButton>
                </div>
              )}
              dropZoneProps={({ isDragging, disabled, error }) => {
                let borderColor = 'divider';
                if (error) {
                  borderColor = 'error.main';
                } else if (isDragging) {
                  borderColor = 'success.main';
                }
                return {
                  sx: {
                    border: '2px solid',
                    borderColor,
                    bgcolor: isDragging ? 'success.50' : 'background.paper',
                    opacity: disabled ? 0.5 : 1,
                    p: 3,
                    borderRadius: 1
                  }
                };
              }}
              renderFileItem={({ file, removeFile }) => (
                <UploadedFile file={file} onRemove={removeFile} />
              )}
            />
          </Grid>
          <Grid size={12}>
            <SubmitButton />
            <ResetButton onClick={() => reset(initialValues)} />
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
};

export default InputsWithRegisterForm;
