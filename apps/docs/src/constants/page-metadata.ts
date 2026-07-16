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
    title: 'MUI Components',
    description:
      'Production-ready, form-library-independent Material UI components with consistent labels, helper text and validation UI.'
  },
  introduction: {
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
  completeFormZod: {
    title: 'Complete Form with Zod',
    description:
      'A complete form showcasing all components from this package, with validation handled by Zod and a checkbox to disable all fields.'
  },
  completeFormState: {
    title: 'Complete Form — React state',
    description:
      'Every component in one form, controlled with plain React state and manual validation, with a live values-and-errors readout.'
  },
  completeFormFormik: {
    title: 'Complete Form — Formik',
    description:
      'Every component in one form, integrated with Formik using a direct validate function, with a live values-and-errors readout.'
  },
  completeFormTanStack: {
    title: 'Complete Form — TanStack + Joi',
    description:
      'Every component in one form, integrated with TanStack Form and validated by a Joi schema, with a live values-and-errors readout.'
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
  }
};

/**
 * SEO metadata for every component documentation page, keyed by component
 * name (the picker families use their base component as the page key).
 * Kept separate from the demo-page `pageMetadata` above and version-agnostic,
 * so the same record can back the v2 docs — each `page.mdx` just does
 * `export const metadata = componentMetadata.MUIXxx;`.
 */
export const componentMetadata: Record<string, Metadata> = {
  MUITextField: {
    title: 'TextField',
    description:
      'MUITextField — a controlled Material UI text field with built-in label, error and helper-text handling. Usage, live examples and full props reference.'
  },
  MUIPasswordInput: {
    title: 'MUIPasswordInput',
    description:
      'Controlled Material UI password field with a show/hide toggle, label, error and helper-text handling.'
  },
  MUINumberInput: {
    title: 'MUINumberInput',
    description:
      'Controlled numeric Material UI input with decimal, integer, non-negative and step constraints.'
  },
  MUITagsInput: {
    title: 'MUITagsInput',
    description:
      'Controlled Material UI tags input — type or paste to add chips, with add/delete/paste interception.'
  },
  MUIFileUploader: {
    title: 'MUIFileUploader',
    description:
      'Controlled Material UI file uploader with drag-and-drop, type/size/count validation and custom renderers.'
  },
  MUISelect: {
    title: 'MUISelect',
    description:
      'Controlled Material UI Select supporting single/multiple selection and primitive or object options.'
  },
  MUINativeSelect: {
    title: 'MUINativeSelect',
    description:
      'Controlled Material UI native <select> for lightweight dropdowns, especially on mobile.'
  },
  MUIAutocomplete: {
    title: 'MUIAutocomplete',
    description:
      'Controlled Material UI Autocomplete storing primitive values, with single/multiple and freeSolo support.'
  },
  MUIAutocompleteObject: {
    title: 'MUIAutocompleteObject',
    description:
      'Controlled Material UI Autocomplete that stores the complete option object as its value.'
  },
  MUIMultiAutocomplete: {
    title: 'MUIMultiAutocomplete',
    description:
      'Controlled multi-select Material UI Autocomplete with checkboxes and a Select-All option.'
  },
  MUIMultiAutocompleteObject: {
    title: 'MUIMultiAutocompleteObject',
    description:
      'Controlled multi-select Material UI Autocomplete storing an array of complete option objects.'
  },
  MUICountrySelect: {
    title: 'MUICountrySelect',
    description:
      'Controlled country picker built on Material UI Autocomplete with flags and preferred countries.'
  },
  MUICheckbox: {
    title: 'MUICheckbox',
    description:
      'Controlled single Material UI Checkbox with label and helper-text handling.'
  },
  MUICheckboxGroup: {
    title: 'MUICheckboxGroup',
    description:
      'Controlled group of Material UI checkboxes storing an array of selected option values.'
  },
  MUIRadioGroup: {
    title: 'MUIRadioGroup',
    description:
      'Controlled Material UI RadioGroup for single choice among primitive or object options.'
  },
  MUISwitch: {
    title: 'MUISwitch',
    description:
      'Controlled Material UI Switch (on/off toggle) with label and helper-text handling.'
  },
  MUISlider: {
    title: 'MUISlider',
    description: 'Controlled Material UI Slider for single or range numeric values.'
  },
  MUIRating: {
    title: 'MUIRating',
    description:
      'Controlled Material UI Rating (star) input with label and helper-text handling.'
  },
  MUIDatePicker: {
    title: 'Date Pickers',
    description:
      'Controlled Material UI X date pickers — responsive, desktop, mobile and static variants with label, error and helper-text handling.'
  },
  MUITimePicker: {
    title: 'Time Pickers',
    description:
      'Controlled Material UI X time pickers — responsive, desktop, mobile and static variants with label, error and helper-text handling.'
  },
  MUIDateTimePicker: {
    title: 'Date-Time Pickers',
    description:
      'Controlled Material UI X date-time pickers — responsive, desktop, mobile and static variants with label, error and helper-text handling.'
  },
  MUIColorPicker: {
    title: 'MUIColorPicker',
    description:
      'Controlled color picker built on react-color-palette with label, error and helper-text handling.'
  },
  MUIPhoneInput: {
    title: 'MUIPhoneInput',
    description:
      'Controlled international phone input with country dropdown, search and structured value output.'
  },
  MUIRichTextEditor: {
    title: 'MUIRichTextEditor',
    description:
      'Controlled CKEditor 5 rich text editor with label, error and helper-text handling.'
  }
};

export const formSubmitEventName = 'form_submit';
