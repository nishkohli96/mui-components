import { PropsDescription as P } from '../descriptions';
import { pickerRows, staticPickerRows } from './shared';

/** `MUIDateTimePicker` / `MUIDesktopDateTimePicker` / `MUIMobileDateTimePicker` — shared props surface. */
export const dateTimePickerRows = pickerRows(P.onValueChange_DateTimePicker);

/** `MUIStaticDateTimePicker` — inline variant without a text field. */
export const staticDateTimePickerRows = staticPickerRows(P.onValueChange_DateTimePicker);
