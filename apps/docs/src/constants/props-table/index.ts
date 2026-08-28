/**
 * Props reference rows for every component, defined per component in files
 * mirroring the package structure (`mui` / `mui-pickers` / `misc`). Shared
 * descriptions live in `descriptions.ts`; the `componentProps` record below
 * is what doc pages feed into `PropsTable`.
 *
 * Each row-builder is a function of `PropsDescriptionArgs` — props that link
 * to MUI/MUI X docs resolve their URL from `muiVersion`/`muiPickersVersion`
 * (see `descriptions.ts`). `currentVersionArgs` below pins the version this
 * release actually documents; bumping it is the only change a future v2
 * (MUI 9) needs here.
 */

import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import textFieldRows from './mui/textfield';
import passwordInputRows from './mui/password-input';
import numberInputRows from './mui/number-input';
import otpInputRows from './mui/otp-input';
import tagsInputRows from './mui/tags-input';
import fileUploaderRows from './mui/file-uploader';
import selectRows from './mui/select';
import nativeSelectRows from './mui/native-select';
import autocompleteRows from './mui/autocomplete';
import autocompleteObjectRows from './mui/autocomplete-object';
import multiAutocompleteRows from './mui/multi-autocomplete';
import multiAutocompleteObjectRows from './mui/multi-autocomplete-object';
import countrySelectRows from './mui/country-select';
import checkboxRows from './mui/checkbox';
import checkboxGroupRows from './mui/checkbox-group';
import radioGroupRows from './mui/radio-group';
import switchRows from './mui/switch';
import sliderRows from './mui/slider';
import ratingRows from './mui/rating';
import { datePickerRows } from './mui-pickers/date';
import { timePickerRows } from './mui-pickers/time';
import { dateTimePickerRows } from './mui-pickers/date-time';
import colorPickerRows from './misc/color-picker';
import phoneInputRows from './misc/phone-input';
import richTextEditorRows from './misc/rich-text-editor';

export { PropsDescription, resolveProp } from './descriptions';

/** The MUI / MUI X Date Pickers version this release's docs actually target. */
export const currentVersionArgs: PropsDescriptionArgs = {
  muiVersion: 7,
  muiPickersVersion: 8
};

export const componentProps: Record<string, PropsInfo[]> = Object.freeze({
  MUITextField: textFieldRows(currentVersionArgs),
  MUIPasswordInput: passwordInputRows(currentVersionArgs),
  MUINumberInput: numberInputRows(currentVersionArgs),
  MUIOTPInput: otpInputRows(currentVersionArgs),
  MUITagsInput: tagsInputRows(currentVersionArgs),
  MUIFileUploader: fileUploaderRows(currentVersionArgs),
  MUISelect: selectRows(currentVersionArgs),
  MUINativeSelect: nativeSelectRows(currentVersionArgs),
  MUIAutocomplete: autocompleteRows(currentVersionArgs),
  MUIAutocompleteObject: autocompleteObjectRows(currentVersionArgs),
  MUIMultiAutocomplete: multiAutocompleteRows(currentVersionArgs),
  MUIMultiAutocompleteObject: multiAutocompleteObjectRows(currentVersionArgs),
  MUICountrySelect: countrySelectRows(currentVersionArgs),
  MUICheckbox: checkboxRows(currentVersionArgs),
  MUICheckboxGroup: checkboxGroupRows(currentVersionArgs),
  MUIRadioGroup: radioGroupRows(currentVersionArgs),
  MUISwitch: switchRows(currentVersionArgs),
  MUISlider: sliderRows(currentVersionArgs),
  MUIRating: ratingRows(currentVersionArgs),

  /* All four variants per family (responsive/desktop/mobile/static) share one row set. */
  MUIDatePicker: datePickerRows(currentVersionArgs),
  MUITimePicker: timePickerRows(currentVersionArgs),
  MUIDateTimePicker: dateTimePickerRows(currentVersionArgs),

  MUIColorPicker: colorPickerRows(currentVersionArgs),
  MUIPhoneInput: phoneInputRows(currentVersionArgs),
  MUIRichTextEditor: richTextEditorRows(currentVersionArgs)
});
