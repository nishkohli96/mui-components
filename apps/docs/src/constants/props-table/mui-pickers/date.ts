import { PropsDescription as P } from '../descriptions';
import { pickerRows, staticPickerRows } from './shared';

/** `MUIDatePicker` / `MUIDesktopDatePicker` / `MUIMobileDatePicker` — shared props surface. */
export const datePickerRows = pickerRows(P.onValueChange_DatePicker);

/** `MUIStaticDatePicker` — inline variant without a text field. */
export const staticDatePickerRows = staticPickerRows(P.onValueChange_DatePicker);
