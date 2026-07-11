import { PropsDescription as P } from '../descriptions';
import { pickerRows, staticPickerRows } from './shared';

/** `MUITimePicker` / `MUIDesktopTimePicker` / `MUIMobileTimePicker` — shared props surface. */
export const timePickerRows = pickerRows(P.onValueChange_TimePicker);

/** `MUIStaticTimePicker` — inline variant without a text field. */
export const staticTimePickerRows = staticPickerRows(P.onValueChange_TimePicker);
