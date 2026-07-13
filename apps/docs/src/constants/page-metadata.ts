import type { Metadata } from 'next';

export const defaultPageTitle = 'MUI Components';
export const defaultPageDescription
  = '25+ form-library-independent Material UI form components — docs, live demos and full props reference.';

export const defaultPageKeywords = [
  'react-hook-form',
  'tanstack form',
  'formik',
  'material-ui',
  'mui',
  '@mui/material',
  'mui-rhf',
  'rhf-mui',
  'mui-components',
  '@nish1896/mui-components',
  '@nish1896',
  'react form components',
  'react forms'
];

export const pageMetadata: Record<string, Metadata> = {
  home: {
    title: 'Introduction',
    description:
      '25+ form-library-agnostic Material UI form components — installation, quick start, live demos and full component API reference.'
  },
  gettingStarted: {
    title: 'Getting Started',
    description:
      'Install @nish1896/mui-components, explore the package structure and build your first controlled Material UI form field.'
  },
  autocomplete: {
    title: 'Autocomplete',
    description:
      'Showcase of Autocomplete components — MUIAutocomplete, MUIMultiAutocomplete and MUICountrySelect, designed for selecting single or multiple values in a form.'
  },
  checkboxAndRadio: {
    title: 'CheckboxGroup & RadioGroup with Zod Validation',
    description:
      'Form utilizing MUICheckbox, MUICheckboxGroup & MUIRadioGroup components with validation managed by Zod.'
  },
  completeForm: {
    title: 'Complete Form with Register Options',
    description:
      'A complete form showcasing all components from this package with appropriate validations.'
  },
  completeFormJoi: {
    title: 'Complete Form with Joi',
    description:
      'A complete form showcasing all components from this package, with validation handled by Joi.'
  },
  customization: {
    title: 'Styled form with a reusable component',
    description:
      'A reusable component built on MUITextField, with ConfigProvider supplying default styles and the date adapter.'
  },
  dateTimePickers: {
    title: 'Date & Time Pickers',
    description:
      'A form using MUIDatePicker, MUITimePicker & MUIDateTimePicker components.'
  },
  inputs: {
    title: 'Inputs',
    description:
      'Form utilizing MUITextField, MUIPasswordInput, MUINumberInput, MUITagsInput and MUIFileUploader, controlled with plain React state.'
  },
  miscComponents: {
    title: 'Miscellaneous Components',
    description:
      'Form demonstrating usage of external components like MUIColorPicker, MUIPhoneInput & MUIRichTextEditor.'
  },
  select: {
    title: 'Select with Class-Validator',
    description:
      'Form utilizing MUISelect and MUINativeSelect with validation managed using class-validator.'
  },
  switchSliderRating: {
    title: 'Switch, Slider & Rating with Superstruct validation',
    description:
      'Form utilizing MUISwitch, MUISlider & MUIRating components with validation managed by Superstruct.'
  },
  textfield: {
    title: 'TextField',
    description:
      'MUITextField — a controlled Material UI text field with built-in label, error and helper-text handling. Usage, live examples and full props reference.'
  }
};

export const formSubmitEventName = 'form_submit';
