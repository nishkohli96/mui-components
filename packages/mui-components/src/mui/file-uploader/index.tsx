'use client';

import {
  useContext,
  useState,
  Fragment,
  type Ref,
  type ReactNode,
  type ChangeEvent,
  type DragEvent,
  type FocusEvent,
  type MouseEvent
} from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type FormLabelProps,
  type FormHelperTextProps
} from '@/common';
import { RHFMuiConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  useFieldIds,
  validateFileList
} from '@/utils';
import { HiddenInput, UploadButton } from './components';

export enum FileUploadError {
  sizeExceeded = 'FILE_SIZE_EXCEEDED',
  invalidExtension = 'FILE_TYPE_NOT_ALLOWED',
  limitExceeded = 'FILE_LIMIT_EXCEEDED',
}

export type FileUploadErrorDetails = {
  /** File that failed upload validation. */
  file: File;
  /** Validation errors reported for the file. */
  errors: FileUploadError[];
};

/**
 * Metadata for a file that has already been uploaded and is being
 * passed as initial value for the field in the file uploader component.
 */
export type ExistingUploadedFile = {
  /** Displayed file name. */
  name: string;
  /** URL used as the href on the file name link. */
  url: string;
  /** Optional file size in bytes. */
  size?: number;
};

type FileUploaderOnValueChangeProps = {
  /** New field value after a successful upload, removal, or clear action. */
  newValue: File | File[] | null;
  /** Event that triggered the value change. */
  event:
    | ChangeEvent<HTMLInputElement>
    | DragEvent<HTMLDivElement>
    | MouseEvent<HTMLButtonElement>;
};

/**
 * State passed to `dropZoneProps` when it is provided as a callback.
 */
type FileUploaderDropZoneState = {
  /** Whether a file is currently being dragged over the drop zone. */
  isDragging: boolean;
  /** Whether the uploader is disabled. */
  disabled: boolean;
  /** Whether the uploader is currently displaying a validation error. */
  error: boolean;
};

type FileUploaderDropZoneProps
  = | Omit<BoxProps, 'children'>
    | ((
      { isDragging, disabled, error }: FileUploaderDropZoneState
    ) => Omit<BoxProps, 'children'>);

type RenderExistingFileItemProps = {
  file: ExistingUploadedFile;
  /** Zero-based index of the existing file. */
  index: number;
};

type RenderFileItemProps = {
  file: File;
  /** Zero-based index of the newly selected file. */
  index: number;
  /** Removes this newly selected file from the field value. */
  removeFile: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type MUIFileUploaderProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current value of the field. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   * `undefined`/`null` are treated as no files selected.
   */
  value?: File | File[] | null;
  /**
   * Called with the accepted file value after every upload, removal, or clear action.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Accepted file, accepted file array, or `null` when cleared.
   * @param event - Input, drop, or click event that changed the file value.
   */
  onValueChange: ({
    newValue,
    event
  }: FileUploaderOnValueChangeProps) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Comma-separated list of accepted file types.
   *
   * Examples:
   * - `image/*`
   * - `.pdf,.doc,.docx`
   * - `image/png,image/jpeg`
   */
  accept?: string;
  /**
   * When true, allows selecting multiple files.
   */
  multiple?: boolean;
  /**
   * Maximum file size (in bytes) eligible for upload.
   * Files exceeding this size will be rejected and trigger an error callback.
   *
   * For example, to set a maximum file size of 5 MB:
   * `maxSize={5 * 1024 * 1024}`
   */
  maxSize?: number;
  /**
   * Maximum number of files that can be uploaded.
   *
   * When the limit is exceeded, additional files are rejected and
   * reported through the error callback.
   */
  maxFiles?: number;
  /**
   * Disables the file input and prevents file selection.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Props applied to the drag-and-drop wrapper `Box`.
   *
   * Pass an object for static props, or a callback to style/render from the current
   * drop-zone state. The returned `sx` is merged after the default drop-zone styles,
   * and drag/drop handlers are composed with the internal handlers.
   *
   * This prop is ignored when `disableDragAndDrop` is `true`.
   */
  dropZoneProps?: FileUploaderDropZoneProps;
  /**
   * Disable drag-and-drop functionality and only allow file selection via the upload button.
   * @default false
   */
  disableDragAndDrop?: boolean;
  /**
   * Custom upload button renderer. Receives the hidden file input as children/content.
   */
  renderUploadButton?: (fileInput: ReactNode) => ReactNode;
  /**
   * Pre-existing server-side files.
   *
   * Use `renderExistingFileItem` to render these files in the file list.
   * Existing files are displayed separately from newly uploaded files, and
   * their count is deducted from `maxFiles` during validation.
   */
  existingFiles?: ExistingUploadedFile[];
  /**
   * Custom renderer for each file passed through `existingFiles`.
   *
   * Use this to render server-side files that were uploaded before the
   * current session. The callback receives the file metadata and its
   * zero-based index.
   *
   * Existing files are not stored in the field value and this component
   * does not remove them automatically. Handle deletion in your own renderer
   * if server-side files need to be removed.
   *
   * When omitted, existing files are not rendered.
   */
  renderExistingFileItem?: ({ file, index }: RenderExistingFileItemProps) => ReactNode;
  /**
   * Props applied to the wrapper Box that contains pre-existing server-side files.
   */
  existingFileListProps?: Omit<BoxProps, 'children'>;
  /**
   * Props applied to the wrapper Box that contains newly selected/uploaded files.
   */
  uploadedFileListProps?: Omit<BoxProps, 'children'>;
  /**
   * Custom renderer for each newly selected file stored in the field value.
   *
   * The callback receives the `File`, its zero-based index, and a `removeFile`
   * helper. Call `removeFile(event)` from your remove/delete button to remove
   * that file from the field value. Removal also triggers `onValueChange`.
   *
   * When omitted, newly selected files are not rendered.
   */
  renderFileItem?: ({
    file,
    index,
    removeFile
  }: RenderFileItemProps) => ReactNode;
  /**
   * Callback fired when uploaded files fail type, size, or count validation.
   */
  onUploadError?: (errors: FileUploadErrorDetails[]) => void;
  /**
   * Called when the hidden file input loses focus.
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Ref for the hidden file `<input>` element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * Label content shown for the field. Defaults to a label generated from `fieldName`.
   */
  label?: ReactNode;
  /**
   * When true, renders the field label above the form field instead of inside or beside it.
   */
  showLabelAboveFormField?: boolean;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: Omit<FormLabelProps, 'id'>;
  /**
   * When true, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * Error message for the field. Any non-empty string puts the field into an error state
   * (shown via `FormControl` and surfaced through `FormHelperText`).
   * Pass `undefined` or `null` to clear the error state.
   *
   * Use `renderError` to customize how this message is rendered.
   */
  errorMessage?: string | null;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string and must return
   * renderable content, e.g. wrapping it with an icon or a styled element.
   *
   * @param error - Current `errorMessage` for this file uploader.
   */
  renderError?: (error: string) => ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Helper text shown below the field when there is no visible validation error.
   */
  helperText?: ReactNode;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * When true, the component expands to fill its container width.
   */
  fullWidth?: boolean;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

const MUIFileUploader = ({
  fieldName,
  value,
  onValueChange,
  accept,
  multiple,
  maxFiles,
  maxSize,
  existingFiles = [],
  renderExistingFileItem,
  existingFileListProps,
  uploadedFileListProps,
  renderUploadButton,
  renderFileItem,
  disabled: muiDisabled,
  onUploadError,
  onBlur,
  inputRef,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  fullWidth = false,
  disableDragAndDrop = false,
  dropZoneProps,
  customIds
}: MUIFileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );
  const { allLabelsAboveFields } = useContext(RHFMuiConfigContext);
  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

  const serverFileCount = existingFiles.length;
  const fieldValue = value ?? null;

  const isError = !!errorMessage;
  const fieldErrorMessage = isError
    ? renderError?.(errorMessage) ?? errorMessage
    : undefined;
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  const updateFieldValue = (
    newValue: File | File[] | null,
    event:
      | ChangeEvent<HTMLInputElement>
      | DragEvent<HTMLDivElement>
      | MouseEvent<HTMLButtonElement>
  ) => {
    onValueChange({ newValue, event });
  };

  const processFiles = (
    files: FileList | File[] | null,
    event: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
  ) => {
    if (!files || files.length === 0) {
      updateFieldValue(null, event);
      return;
    }

    const incomingFiles = Array.from(files);
    const previousFiles: File[] = multiple
      ? Array.isArray(fieldValue)
        ? fieldValue
        : fieldValue instanceof File
          ? [fieldValue]
          : []
      : [];

    const remainingFileSlots
      = maxFiles !== undefined
        ? Math.max(0, maxFiles - serverFileCount - previousFiles.length)
        : undefined;

    const { acceptedFiles, rejectedFiles } = validateFileList(incomingFiles, {
      accept,
      maxSize
    });
    const fileErrors = [...rejectedFiles];
    let acceptedIncomingFiles = acceptedFiles;

    if (
      remainingFileSlots !== undefined
      && acceptedIncomingFiles.length > remainingFileSlots
    ) {
      const excessFiles = acceptedIncomingFiles.slice(remainingFileSlots);
      acceptedIncomingFiles
        = acceptedIncomingFiles.slice(0, remainingFileSlots);
      fileErrors.push(
        ...excessFiles.map(file => ({
          file,
          errors: [FileUploadError.limitExceeded]
        }))
      );
    }
    if (fileErrors.length > 0) {
      onUploadError?.(fileErrors);
    }

    const finalAcceptedFiles = multiple
      ? [...previousFiles, ...acceptedIncomingFiles]
      : acceptedIncomingFiles;
    const newValue = multiple
      ? finalAcceptedFiles.length > 0
        ? finalAcceptedFiles
        : null
      : (finalAcceptedFiles[0] ?? null);
    updateFieldValue(newValue, event);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files, event);
    /**
     * Reset so the same file(s) can be selected again in
     * a subsequent pick
     */
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (muiDisabled) {
      return;
    }
    if (event.dataTransfer.files.length === 0) {
      return;
    }
    processFiles(event.dataTransfer.files, event);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!muiDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setIsDragging(false);
  };

  const handleRemoveFile = (
    index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    let newValue: File | File[] | null;
    if (multiple && Array.isArray(fieldValue)) {
      const newFiles = fieldValue.filter(
        (_: File, i: number) => i !== index
      );
      newValue = newFiles.length > 0 ? newFiles : null;
    } else {
      newValue = null;
    }
    updateFieldValue(newValue, event);
  };

  const InputComponent = (
    <HiddenInput
      id={fieldId}
      name={fieldName}
      type="file"
      ref={inputRef}
      accept={accept}
      multiple={multiple}
      onChange={handleFileChange}
      onBlur={onBlur}
      disabled={muiDisabled}
      aria-labelledby={!hideLabel && isLabelAboveFormField ? labelId : undefined}
      aria-label={hideLabel ? accessibleFieldLabel : undefined}
      aria-describedby={
        showHelperTextElement
          ? isError
            ? errorId
            : helperTextId
          : undefined
      }
      aria-invalid={isError}
      aria-required={required}
    />
  );

  const uploadAreaContent = renderUploadButton
    ? (
      renderUploadButton(InputComponent)
    )
    : (
      <UploadButton
        label={
          typeof fieldLabel === 'string'
            ? fieldLabel
            : `Upload ${defaultFieldLabel}`
        }
        fieldName={fieldName}
        disabled={muiDisabled}
      >
        {InputComponent}
      </UploadButton>
    );

  const resolvedDropZoneProps = typeof dropZoneProps === 'function'
    ? dropZoneProps({
      isDragging,
      disabled: !!muiDisabled,
      error: isError
    })
    : (dropZoneProps ?? {});
  const {
    sx: dropZoneSx,
    onDragEnter: dropZoneOnDragEnter,
    onDragOver: dropZoneOnDragOver,
    onDragLeave: dropZoneOnDragLeave,
    onDrop: dropZoneOnDrop,
    ...restDropZoneProps
  } = resolvedDropZoneProps;

  const dropZoneContent = !disableDragAndDrop
    ? (
      <Box
        {...restDropZoneProps}
        onDragEnter={event => {
          handleDragOver(event);
          dropZoneOnDragEnter?.(event);
        }}
        onDragOver={event => {
          handleDragOver(event);
          dropZoneOnDragOver?.(event);
        }}
        onDragLeave={event => {
          handleDragLeave(event);
          dropZoneOnDragLeave?.(event);
        }}
        onDrop={event => {
          handleDrop(event);
          dropZoneOnDrop?.(event);
        }}
        sx={[
          {
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.400',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            transition: 'border-color 0.2s ease-in-out',
            mb: 2,
            cursor: muiDisabled ? 'not-allowed' : 'pointer'
          },
          ...(Array.isArray(dropZoneSx)
            ? dropZoneSx
            : dropZoneSx
              ? [dropZoneSx]
              : [])
        ]}
      >
        {uploadAreaContent}
      </Box>
    )
    : (
      uploadAreaContent
    );

  return (
    <FormControl
      fullWidth={fullWidth}
      error={isError}
      disabled={muiDisabled}
    >
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveFormField}
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            htmlFor: fieldId
          }}
        />
      )}
      {dropZoneContent}
      <FormHelperText
        error={isError}
        errorMessage={fieldErrorMessage}
        hideErrorMessage={hideErrorMessage}
        helperText={helperText}
        showHelperTextElement={showHelperTextElement}
        formHelperTextProps={{
          ...formHelperTextProps,
          id: isError ? errorId : helperTextId
        }}
      />
      {/* Pre-existing server files rendered above new uploads */}
      {existingFiles.length > 0 && renderExistingFileItem && (
        <Box {...existingFileListProps}>
          {existingFiles.map((file, index) => (
            <Fragment key={`existing-${file.name}-${index}`}>
              {renderExistingFileItem({ file, index })}
            </Fragment>
          ))}
        </Box>
      )}
      {/* New uploads from the current session */}
      {fieldValue && renderFileItem && (
        <Box {...uploadedFileListProps}>
          {(Array.isArray(fieldValue) ? fieldValue : [fieldValue]).map(
            (file: File, index: number) => (
              <Fragment key={`${file.name}-${file.lastModified}-${index}`}>
                {renderFileItem({
                  file,
                  index,
                  removeFile: event => handleRemoveFile(index, event)
                })}
              </Fragment>
            )
          )}
        </Box>
      )}
    </FormControl>
  );
};

export default MUIFileUploader;
