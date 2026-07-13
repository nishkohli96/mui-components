import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIFileUploader`. */
const fileUploaderRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_FileUploader,
  P.onValueChange_FileUploader,
  P.accept,
  P.multiple_FileUploader,
  P.maxSize,
  P.maxFiles,
  P.onUploadError,
  P.dropZoneProps,
  P.disableDragAndDrop,
  P.renderUploadButton,
  P.existingFiles,
  P.renderExistingFileIte,
  P.renderFileItem,
  P.existingFileListProps,
  P.uploadedFileListProps,
  P.inputRef_FileUploader,
  P.fullWidth_FileUploader,
  P.required,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default fileUploaderRows;
