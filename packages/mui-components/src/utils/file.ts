import {
  FileUploadError,
  type FileUploadErrorDetails
} from '@/mui/file-uploader';

type FileSizeOptions = {
  valueAsNumber?: boolean;
  precision?: number;
};

type ProcessFilesResult = {
  acceptedFiles: File[];
  rejectedFiles: FileUploadErrorDetails[];
};

type ValidateFileListOptions = {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
};

/**
 * Formats a byte count into a human-readable file size string
 * (bytes/KB/MB/GB), picking the largest unit under 1024.
 *
 * @param size - File size in bytes. Must be a non-negative number.
 * @param options.valueAsNumber - When true, rounds the value to the nearest
 * integer instead of applying `precision`. Default `false`.
 * @param options.precision - Decimal places to show for KB/MB/GB values;
 * trailing zeros are stripped. Default `1`.
 * @throws {Error} If `size` is negative.
 */
export function getFileSize(size: number, options?: FileSizeOptions): string {
  if (size < 0) {
    throw new Error('Invalid file size. It must be a positive number.');
  }
  if (size === 0) {
    return '0 bytes';
  }

  const { valueAsNumber = false, precision = 1 } = options ?? {};
  const conversionFactor = 1024;

  /* Utility to remove .0 if no decimal part exists */
  const format = (value: number, unit: string): string => {
    const roundedValue = value.toFixed(precision);
    const formattedValue = roundedValue
      .replace(/(\.\d*?)0+$/, '$1')
      .replace(/\.$/, '');
    return valueAsNumber ? `${Math.round(value)} ${unit}` : `${formattedValue} ${unit}`;
  };

  if (size < conversionFactor) {
    return `${size} bytes`;
  }

  const kb = size / conversionFactor;
  if (kb < conversionFactor) {
    return format(kb, 'KB');
  }

  const mb = kb / conversionFactor;
  if (mb < conversionFactor) {
    return format(mb, 'MB');
  }

  const gb = mb / conversionFactor;
  return format(gb, 'GB');
}

/**
 * Validates a `FileList` (or `File[]`) against accepted file types, a max
 * file size, and a max file count, splitting it into accepted and rejected
 * files with per-file error reasons.
 *
 * @param fileList - Files to validate, e.g. from an `<input type="file">` change event or drag-and-drop.
 * @param options - Validation constraints.
 * @param options.accept - Comma-separated MIME types/extensions to allow (e.g. `'image/*,.pdf'`).
 *   All types are allowed when omitted.
 * @param options.maxSize - Maximum allowed file size in bytes.
 * @param options.maxFiles - Maximum number of files allowed.
 * @returns
 *   - `acceptedFiles` that passed every check
 *   - `rejectedFiles` each rejected file paired with its `FileUploadErrorDetails`.
 */
export function validateFileList(
  fileList: FileList | File[],
  options?: ValidateFileListOptions
): ProcessFilesResult {
  const { accept, maxFiles, maxSize } = options ?? {};
  const files = Array.from(fileList);
  const acceptedFiles: File[] = [];
  const rejectedFiles: FileUploadErrorDetails[] = [];

  /* Parse the accept string into an array of acceptable types/extensions */
  const acceptedTypes = accept
    ? accept
      .split(',')
      .map(type => type.trim().toLowerCase())
    : [];

  const isTypeAllowed = (file: File) => {
    if (!accept) {
      return true;
    }

    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptedTypes.some(acceptedType => {
      if (acceptedType.startsWith('.')) {
        return fileExtension === acceptedType;
      } else if (acceptedType.endsWith('/*')) {
        const typePrefix = acceptedType.replace('/*', '');
        return fileType.startsWith(typePrefix);
      } else {
        return fileType === acceptedType;
      }
    });
  };

  files.forEach(file => {
    const validationErrors: FileUploadError[] = [];

    if (maxSize !== undefined && file.size > maxSize) {
      validationErrors.push(FileUploadError.sizeExceeded);
    }

    if (!isTypeAllowed(file)) {
      validationErrors.push(FileUploadError.invalidExtension);
    }

    if (validationErrors.length > 0) {
      rejectedFiles.push({ file, errors: validationErrors });
    } else {
      acceptedFiles.push(file);
    }
  });

  if (maxFiles !== undefined && acceptedFiles.length > maxFiles) {
    const excessFiles = acceptedFiles.slice(maxFiles);
    acceptedFiles.splice(maxFiles);
    rejectedFiles.push(
      ...excessFiles.map(file => ({
        file,
        errors: [FileUploadError.limitExceeded]
      }))
    );
  }

  return {
    acceptedFiles,
    rejectedFiles,
  };
}
