import type { PropsInfo, MuiPropsDescriptionArgs } from '@/types';
import { resolveProp } from '@/utils';
import { PropsDescription as P } from '../descriptions/latest';

/** Props reference rows for `MUIFileUploader`. */
const fileUploaderRows = (args: MuiPropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_FileUploader,
  P.onValueChange_FileUploader,
  P.accept,
  P.multiple_FileUploader,
  P.maxSize,
  P.maxFiles,
  P.onUploadError,
  P.fullWidth_FileUploader,
  resolveProp(P.dropZoneProps, args),
  P.disableDragAndDrop,
  P.renderUploadButton,
  P.existingFiles,
  P.renderExistingFileIte,
  P.renderFileItem,
  resolveProp(P.existingFileListProps, args),
  resolveProp(P.uploadedFileListProps, args),
  P.inputRef_FileUploader,
  P.label,
  resolveProp(P.showLabelAboveFormField, args),
  resolveProp(P.formLabelProps, args),
  P.hideLabel,
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default fileUploaderRows;
