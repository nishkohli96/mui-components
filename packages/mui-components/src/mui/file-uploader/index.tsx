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
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  useFieldIds,
  validateFileList,
  getErrorList
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

/**
 * Field value shape derived from `multiple`: an array of files when `multiple`
 * is `true`, otherwise a single file.
 *
 * `null` belongs only to the single-file branch — a multi-file field clears to
 * `[]`, matching `MUIMultiAutocomplete` and `MUITagsInput`. Tuple checks avoid
 * distributive `boolean` breaking the conditional.
 */
type FileUploaderValue<Multiple extends boolean> = [Multiple] extends [true]
  ? File[]
  : File | null;

type FileUploaderChangeEvent
  = | ChangeEvent<HTMLInputElement>
    | DragEvent<HTMLDivElement>
    | MouseEvent<HTMLButtonElement>;

type FileUploaderOnValueChangeProps<Multiple extends boolean> = {
  /** New field value after a successful upload, removal, or clear action. */
  newValue: FileUploaderValue<Multiple>;
  /** Event that triggered the value change. */
  event: FileUploaderChangeEvent;
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

export type MUIFileUploaderProps<Multiple extends boolean = false> = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current value of the field. When `multiple` is `true` this is `File[]`,
   * otherwise `File | null`. This is a controlled component: `value` and
   * `onValueChange` must be supplied together, typically backed by your own state
   * or form library. `undefined` is treated as no files selected.
   */
  value?: FileUploaderValue<Multiple>;
  /**
   * Called with the accepted file value after every upload, removal, or clear
   * action. `newValue` is `File[]` when `multiple` is `true`, otherwise
   * `File | null`. Call your state setter (or form library's setter) with
   * `newValue` to update `value`.
   *
   * @param newValue - Accepted file(s). Clearing yields `[]` for a multi-file
   *   field and `null` for a single-file field.
   * @param event - Input, drop, or click event that changed the file value.
   */
  onValueChange: ({
    newValue,
    event
  }: FileUploaderOnValueChangeProps<Multiple>) => void;
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
   * When true, allows selecting multiple files, and `value` / `onValueChange`
   * operate on `File[]` instead of a single `File`.
   */
  multiple?: Multiple;
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
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
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
   * Validation error for the field — pass a single message `string`, or a
   * `string[]` when the field can fail multiple rules at once (every message
   * is shown together).
   *
   * A non-empty string or a non-empty array puts the field into an error state
   * and surfaces the message(s) through `FormHelperText`; `undefined`, `''` or
   * `[]` clear it.
   *
   * Use `renderError` to customize how the message(s) are rendered.
   */
  errorMessage?: string | string[];
  /**
   * Custom renderer for the resolved error message(s), called only when the
   * field is in an error state. Always receives a `string[]` — use `errors[0]`
   * for the common single-message case, or map over `errors` when a field fails
   * several rules.
   *
   * When omitted, a single message renders as plain text and multiple
   * messages render on separate lines.
   *
   * @param errors - Resolved error messages for this field (never empty).
   */
  renderError?: (errors: string[]) => ReactNode;
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

/**
 * Drag-and-drop + click-to-browse file uploader, generic over `Multiple` so
 * `value` is a single `File` or an array depending on the `multiple` prop.
 *
 * Validates every incoming file against `accept`/`maxSize` individually;
 * `maxFiles` caps the total across `existingFiles`, previously
 * selected files, and the incoming batch, rejecting only the excess.
 *
 * Docs: [MUIFileUploader](https://mui-components-docs.vercel.app/v1/components/mui/file-uploader)
 *
 * API: [MUIFileUploaderProps](https://mui-components-docs.vercel.app/v1/components/mui/file-uploader#api)
 */
const MUIFileUploader = <Multiple extends boolean = false>({
  fieldName,
  value: valueProp,
  onValueChange: onValueChangeProp,
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
}: MUIFileUploaderProps<Multiple>) => {
  /*
   * The public `value` / `onValueChange` are typed on `Multiple`; internally
   * the component works with the broad `File | File[] | null` shape and narrows
   * at runtime via `multiple`.
   */
  const value = valueProp;
  const onValueChange = onValueChangeProp as (
    props: { newValue: File | File[] | null; event: FileUploaderChangeEvent }
  ) => void;

  const [isDragging, setIsDragging] = useState(false);
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
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

  /**
   * Files uploaded in this session, always as a list.
   *
   * `Array.isArray` can't narrow `FileUploaderValue<Multiple>` while `Multiple`
   * is still generic, so pair it with an `instanceof File` check and annotate
   * the target — the same approach used when merging previous files below.
   */
  const uploadedFiles: File[] = Array.isArray(fieldValue)
    ? fieldValue
    : fieldValue instanceof File
      ? [fieldValue]
      : [];

  const errorList = getErrorList(errorMessage);
  const isError = errorList.length > 0;
  const fieldErrorMessage = isError
    ? renderError?.(errorList) ?? (
      errorList.length === 1
        ? errorList[0]
        : errorList.map((message, index) => (
          <div key={index}>
            {message}
          </div>
        ))
    )
    : undefined;
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  /**
   * Internal setter. The parameter stays loose because `FileUploaderValue<Multiple>`
   * is a deferred conditional while `Multiple` is generic, so TS can't prove a
   * computed value matches it. Callers must uphold the contract: pass `File[]`
   * (`[]` when empty) whenever `multiple` is set, and `File`/`null` otherwise.
   */
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
      updateFieldValue(multiple ? [] : null, event);
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
    /* A multi-file field always holds an array — `[]` when nothing was accepted. */
    const newValue = multiple
      ? finalAcceptedFiles
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
      /* Removing the last file leaves an empty list, not `null`. */
      newValue = fieldValue.filter((_: File, i: number) => i !== index);
    } else {
      newValue = multiple ? [] : null;
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
      {uploadedFiles.length > 0 && renderFileItem && (
        <Box {...uploadedFileListProps}>
          {uploadedFiles.map((file, index) => (
            <Fragment key={`${file.name}-${file.lastModified}-${index}`}>
              {renderFileItem({
                file,
                index,
                removeFile: event => handleRemoveFile(index, event)
              })}
            </Fragment>
          ))}
        </Box>
      )}
    </FormControl>
  );
};

export default MUIFileUploader;
