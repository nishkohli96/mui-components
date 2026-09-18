/**
 * The exact fallback string `/api/answer` returns when no retrieved chunk
 * clears the relevance threshold. Shared with the eval harness (apps/rag),
 * which checks answers against this exact string to verify the "not
 * covered" guardrail actually fires — kept here so the two can't drift.
 */
export const NOT_COVERED_ANSWER = "🔍 This isn't covered in the MUI Components docs.";

/**
 * Every documented component name, MUI-prefixed. Manually maintained,
 * same as the docs app's own `componentProps` record in
 * `apps/docs/src/constants/props-table/index.ts` — keep in sync when a
 * component is added or renamed there. Used to expand queries like
 * "number-input" or "numberinput" (no prefix, hyphenated, typo'd casing)
 * to the canonical "MUINumberInput" before embedding, since the corpus
 * text always uses the canonical name and a raw query without it can
 * embed too far from the right chunk to clear the relevance threshold.
 */
export const componentNames = [
  'MUITextField',
  'MUIPasswordInput',
  'MUINumberInput',
  'MUINumberStepper',
  'MUIOTPInput',
  'MUITagsInput',
  'MUIFileUploader',
  'MUISelect',
  'MUINativeSelect',
  'MUIUnitInput',
  'MUIAutocomplete',
  'MUIAutocompleteObject',
  'MUICountrySelect',
  'MUIMultiAutocomplete',
  'MUIMultiAutocompleteObject',
  'MUICheckbox',
  'MUICheckboxGroup',
  'MUIRadioGroup',
  'MUISwitch',
  'MUISlider',
  'MUIRating',
  'MUIDatePicker',
  'MUITimePicker',
  'MUIDateTimePicker',
  'MUIColorPicker',
  'MUIRichTextEditor',
  'MUITipTapRte',
  'MUIPhoneInput'
];
