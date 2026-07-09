'use client';

import {
  useContext,
  forwardRef,
  type ReactNode,
  type Ref
} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { ClassicEditor } from 'ckeditor5';
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
  resolveLabelAboveControl,
  useFieldIds
} from '@/utils';
import { DefaultEditorConfig } from './config';
import 'ckeditor5/ckeditor5.css';

/**
 * CK Editor Props ref -
 * https://ckeditor.com/docs/ckeditor5/latest/getting-started/legacy/legacy-integrations/react.html#context-feature-properties
 */

type ErrorDetails = {
  phase: 'initialization' | 'runtime';
  willContextRestart?: boolean;
};

type MUIRichTextEditorOnValueChangeProps = {
  newValue: string;
  event: EventInfo;
  editor: ClassicEditor;
};

export type MUIRichTextEditorProps = {
  /**
   * Name/path of the field. Used to derive generated ids and the default label.
   */
  fieldName: string;
  /**
   * Current editor HTML string.
   */
  value?: string | null;
  /**
   * Called when CKEditor content changes.
   */
  onValueChange: ({
    newValue,
    event,
    editor
  }: MUIRichTextEditorOnValueChangeProps) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * HTML id applied to the CKEditor instance.
   *
   * Defaults to the generated field id.
   */
  id?: string;
  /**
   * CKEditor configuration passed to `ClassicEditor`.
   *
   * Defaults to this package's `DefaultEditorConfig`.
   */
  editorConfig?: EditorConfig;
  /**
   * Callback fired when the CKEditor instance is ready.
   */
  onReady?: (editor: ClassicEditor) => void;
  /**
   * Callback fired when the CKEditor instance receives focus.
   */
  onFocus?: (event: EventInfo<string, unknown>, editor: ClassicEditor) => void;
  /**
   * Callback fired when the CKEditor instance loses focus.
   */
  onBlur?: (event: EventInfo<string, unknown>, editor: ClassicEditor) => void;
  /**
   * When true, disables the field and associated controls.
   */
  disabled?: boolean;
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
   * Callback fired when CKEditor reports an initialization or runtime error.
   */
  onError?: (error: Error, details: ErrorDetails) => void;
  /**
   * Error message for the field. Any non-empty string puts the field into an error state.
   */
  errorMessage?: string | null;
  /**
   * Custom renderer for `errorMessage`. Receives the raw error string.
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
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

const MUIRichTextEditor = forwardRef(function MUIRichTextEditor(
  {
    fieldName,
    value,
    onValueChange,
    required,
    id,
    editorConfig,
    onReady,
    onFocus,
    onBlur,
    disabled: muiDisabled,
    label,
    showLabelAboveFormField,
    formLabelProps,
    hideLabel,
    onError,
    errorMessage,
    renderError,
    hideErrorMessage,
    helperText,
    formHelperTextProps,
    customIds
  }: MUIRichTextEditorProps,
  ref: Ref<CKEditor<ClassicEditor>>
) {
  const { allLabelsAboveFields } = useContext(RHFMuiConfigContext);
  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;
  const isLabelAboveControl = resolveLabelAboveControl(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const isError = !!errorMessage;
  const fieldErrorMessage = isError
    ? renderError?.(errorMessage) ?? errorMessage
    : undefined;
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  return (
    <FormControl error={isError} disabled={muiDisabled}>
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveControl}
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
      <CKEditor
        id={id ?? fieldId}
        editor={ClassicEditor}
        config={editorConfig ?? DefaultEditorConfig}
        data={value ?? ''}
        onChange={(event, editor) => {
          onValueChange({
            newValue: editor.getData(),
            event,
            editor
          });
        }}
        ref={ref}
        onReady={onReady}
        onBlur={onBlur}
        aria-labelledby={
          !hideLabel && isLabelAboveControl ? labelId : undefined
        }
        aria-label={hideLabel ? accessibleFieldLabel : undefined}
        aria-describedby={
          showHelperTextElement
            ? isError
              ? errorId
              : helperTextId
            : undefined
        }
        aria-required={required}
        onFocus={onFocus}
        onError={onError}
        disabled={muiDisabled}
      />
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
    </FormControl>
  );
});

export { DefaultEditorConfig };
export default MUIRichTextEditor;
