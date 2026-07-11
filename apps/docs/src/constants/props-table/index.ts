/**
 * Props reference rows for every component, defined per component in files
 * mirroring the package structure (`mui` / `mui-pickers` / `misc`). Shared
 * descriptions live in `descriptions.ts`; the `ComponentProps` record below
 * is what doc pages feed into `PropsTable`.
 */

import type { PropsInfo } from '@/types';
import textFieldRows from './mui/textfield';
import passwordInputRows from './mui/password-input';
import numberInputRows from './mui/number-input';
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
import { datePickerRows, staticDatePickerRows } from './mui-pickers/date';
import { timePickerRows, staticTimePickerRows } from './mui-pickers/time';
import { dateTimePickerRows, staticDateTimePickerRows } from './mui-pickers/date-time';
import colorPickerRows from './misc/color-picker';
import phoneInputRows from './misc/phone-input';
import richTextEditorRows from './misc/rich-text-editor';

export { PropsDescription } from './descriptions';

export const ComponentProps: Record<string, PropsInfo[]> = Object.freeze({
  MUITextField: textFieldRows,
  MUIPasswordInput: passwordInputRows,
  MUINumberInput: numberInputRows,
  MUITagsInput: tagsInputRows,
  MUIFileUploader: fileUploaderRows,
  MUISelect: selectRows,
  MUINativeSelect: nativeSelectRows,
  MUIAutocomplete: autocompleteRows,
  MUIAutocompleteObject: autocompleteObjectRows,
  MUIMultiAutocomplete: multiAutocompleteRows,
  MUIMultiAutocompleteObject: multiAutocompleteObjectRows,
  MUICountrySelect: countrySelectRows,
  MUICheckbox: checkboxRows,
  MUICheckboxGroup: checkboxGroupRows,
  MUIRadioGroup: radioGroupRows,
  MUISwitch: switchRows,
  MUISlider: sliderRows,
  MUIRating: ratingRows,

  /* Picker variations share their family's rows — no per-variation entries. */
  MUIDatePicker: datePickerRows,
  MUIStaticDatePicker: staticDatePickerRows,
  MUITimePicker: timePickerRows,
  MUIStaticTimePicker: staticTimePickerRows,
  MUIDateTimePicker: dateTimePickerRows,
  MUIStaticDateTimePicker: staticDateTimePickerRows,

  MUIColorPicker: colorPickerRows,
  MUIPhoneInput: phoneInputRows,
  MUIRichTextEditor: richTextEditorRows
});
