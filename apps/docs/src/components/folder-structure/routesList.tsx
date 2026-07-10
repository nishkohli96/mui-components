import {
  MuiComponents,
  MuiPickersComponents,
  MiscComponents,
  type DocsVersion
} from '@/types';

const rootDir = '/components';
const muiPrefix = '/mui';
const muiPickersPrefix = '/mui-pickers';
const miscPrefix = '/misc';

const muiComponents = [
  MuiComponents.TextField,
  MuiComponents.NumberInput,
  MuiComponents.PasswordInput,
  MuiComponents.TagsInput,
  MuiComponents.FileUploader,
  MuiComponents.Select,
  MuiComponents.NativeSelect,
  MuiComponents.Autocomplete,
  MuiComponents.AutocompleteObject,
  MuiComponents.MultiAutocomplete,
  MuiComponents.MultiAutocompleteObject,
  MuiComponents.CountrySelect,
  MuiComponents.Checkbox,
  MuiComponents.CheckboxGroup,
  MuiComponents.RadioGroup,
  MuiComponents.Slider,
  MuiComponents.Switch,
  MuiComponents.Rating
];

const muiPickersComponents = [
  MuiPickersComponents.DatePicker,
  MuiPickersComponents.TimePicker,
  MuiPickersComponents.DateTimePicker
];

const miscComponents = [
  MiscComponents.ColorPicker,
  MiscComponents.RichTextEditor,
  MiscComponents.PhoneInput
];

export function getMuiFoldersList(docsVersion?: DocsVersion) {
  return muiComponents.map(component => ({
    name: component,
    path: `${docsVersion ? `/v${docsVersion}` : ''}${rootDir}${muiPrefix}/${component}`
  }));
}

export function getMuiPickersFoldersList(docsVersion?: DocsVersion) {
  return muiPickersComponents.map(component => ({
    name: component,
    path: `${docsVersion ? `/v${docsVersion}` : ''}${rootDir}${muiPickersPrefix}/${component}`
  }));
}

export function getMiscFoldersList(docsVersion?: DocsVersion) {
  return miscComponents.map(component => ({
    name: component,
    path: `${docsVersion ? `/v${docsVersion}` : ''}${rootDir}${miscPrefix}/${component}`
  }));
}
