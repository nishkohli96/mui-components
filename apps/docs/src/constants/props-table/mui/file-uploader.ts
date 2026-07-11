import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUIFileUploader`. */
const fileUploaderRows: PropsInfo[] = [
  P.fieldName,
  P.value_FileUploader,
  P.onValueChange_FileUploader,
  {
    name: 'accept',
    description:
      'Comma-separated list of accepted file types, e.g. `image/*` or `.pdf,.doc,.docx`.',
    type: 'string'
  },
  {
    name: 'multiple',
    description: 'When true, allows selecting multiple files.',
    type: 'boolean'
  },
  {
    name: 'maxSize',
    description:
      'Maximum file size (in bytes) eligible for upload. Larger files are rejected and reported through `onUploadError`.',
    type: 'number'
  },
  {
    name: 'maxFiles',
    description:
      'Maximum number of files that can be uploaded. Excess files are rejected and reported through `onUploadError`. Files in `existingFiles` count against the limit.',
    type: 'number'
  },
  {
    name: 'onUploadError',
    description:
      'Callback fired when uploaded files fail type, size, or count validation.',
    type: '(errors: FileUploadErrorDetails[]) => void'
  },
  {
    name: 'dropZoneProps',
    description:
      'Props applied to the drag-and-drop wrapper `Box`. Pass an object, or a callback receiving `{ isDragging, disabled, error }`. Ignored when `disableDragAndDrop` is true.',
    type: 'BoxProps | (state) => BoxProps'
  },
  {
    name: 'disableDragAndDrop',
    description:
      'Disable drag-and-drop and only allow file selection via the upload button.',
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'renderUploadButton',
    description:
      'Custom upload button renderer. Receives the hidden file input as children/content.',
    type: '(fileInput: ReactNode) => ReactNode'
  },
  {
    name: 'existingFiles',
    description:
      'Pre-existing server-side files, displayed separately from new uploads via `renderExistingFileItem`.',
    type: 'ExistingUploadedFile[]'
  },
  {
    name: 'renderExistingFileItem',
    description:
      'Custom renderer for each file passed through `existingFiles`. These files are not part of `value` and are not removed automatically.',
    type: '({ file, index }) => ReactNode'
  },
  {
    name: 'renderFileItem',
    description:
      'Custom renderer for each newly selected file. Call the provided `removeFile(event)` from your remove button to delete the file from the value.',
    type: '({ file, index, removeFile }) => ReactNode'
  },
  {
    name: 'existingFileListProps',
    description: 'Props applied to the wrapper Box containing existing files.',
    type: 'BoxProps'
  },
  {
    name: 'uploadedFileListProps',
    description: 'Props applied to the wrapper Box containing new uploads.',
    type: 'BoxProps'
  },
  {
    name: 'inputRef',
    description: 'Ref for the hidden file `<input>` element.',
    type: 'Ref<HTMLInputElement>'
  },
  {
    name: 'fullWidth',
    description: 'When true, the component expands to fill its container width.',
    type: 'boolean',
    defaultValue: 'false'
  },
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.helperText,
  P.showLabelAboveFormField,
  P.hideLabel,
  P.formLabelProps,
  P.formHelperTextProps,
  P.customIds
];

export default fileUploaderRows;
