'use client';

import { useState } from 'react';
import MUITextField from '@nish1896/mui-components/mui/textfield';

export default function BasicTextField() {
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState<string>();

  return (
    <MUITextField
      fieldName="firstName"
      value={firstName}
      onValueChange={({ newValue }) => {
        setFirstName(newValue);
        setError(undefined);
      }}
      onBlur={() => {
        setError(firstName ? undefined : 'First name is required');
      }}
      errorMessage={error}
      helperText="Value and validation live in your own state"
      required
    />
  );
}
