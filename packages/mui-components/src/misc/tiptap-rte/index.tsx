'use client';

import {
  useContext,
  useEffect,
  type ReactNode
} from 'react';
import {
  useEditor,
  EditorContent,
  type Editor,
  type AnyExtension
} from '@tiptap/react';
import Box from '@mui/material/Box';
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
  resolveLabelAboveControl,
  useFieldIds,
  getErrorList
} from '@/utils';
import { DefaultEditorExtensions } from './config';
import Toolbar from './Toolbar';

type MUITipTapRteOnValueChangeProps = {
  newValue: string;
  editor: Editor;
};

export type MUITipTapRteProps = {
  /**
   * Name/path of the field. Used to derive generated ids and the default label.
   */
  fieldName: string;
  /**
   * Current editor HTML string. This is a controlled component: `value` and
   * `onValueChange` must be supplied together. `undefined`/`null` render an
   * empty editor.
   */
  value?: string | null;
  /**
   * Called when the editor content changes.
   */
  onValueChange: ({ newValue, editor }: MUITipTapRteOnValueChangeProps) => void;
  /**
   * When true, marks the field as required in the UI and accessibility attributes.
   */
  required?: boolean;
  /**
   * Tiptap extensions passed to `useEditor`.
   *
   * Defaults to this package's `DefaultEditorExtensions`.
   */
  editorExtensions?: AnyExtension[];
  /**
   * Callback fired when the Tiptap editor instance is created.
   */
  onReady?: (editor: Editor) => void;
  /**
   * Callback fired when the editor receives focus.
   */
  onFocus?: (editor: Editor) => void;
  /**
   * Callback fired when the editor loses focus.
   */
  onBlur?: (editor: Editor) => void;
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
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
};

/**
 * Controlled rich-text editor wrapping Tiptap's headless `useEditor`, backed
 * by an HTML string value — a lighter, dependency-thinner alternative to
 * `MUIRichTextEditor` (CKEditor 5).
 *
 * Ships with a sensible `DefaultEditorExtensions` set (undo/redo, headings
 * 1-3, text styling, lists, blockquote, code blocks, links, alignment) and a
 * hand-built formatting toolbar, since Tiptap ships no UI of its own —
 * override `editorExtensions` to customize.
 *
 * Docs: [MUITipTapRte](https://mui-components-docs.vercel.app/v1/components/misc/tiptap-rte)
 *
 * API: [MUITipTapRteProps](https://mui-components-docs.vercel.app/v1/components/misc/tiptap-rte#api)
 */
const MUITipTapRte = ({
  fieldName,
  value,
  onValueChange,
  required,
  editorExtensions,
  onReady,
  onFocus,
  onBlur,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  customIds
}: MUITipTapRteProps) => {
  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
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
  const showHelperTextElement = !!(
    helperText
    || (isError && !hideErrorMessage)
  );

  const editor = useEditor({
    extensions: editorExtensions ?? DefaultEditorExtensions,
    content: value ?? '',
    editable: !muiDisabled,
    onCreate: ({ editor: createdEditor }) => onReady?.(createdEditor),
    onFocus: ({ editor: focusedEditor }) => onFocus?.(focusedEditor),
    onBlur: ({ editor: blurredEditor }) => onBlur?.(blurredEditor),
    onUpdate: ({ editor: updatedEditor }) => {
      onValueChange({ newValue: updatedEditor.getHTML(), editor: updatedEditor });
    },
    editorProps: {
      attributes: {
        id: fieldId,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': !hideLabel && isLabelAboveControl ? labelId : '',
        'aria-label': hideLabel ? accessibleFieldLabel : '',
        'aria-describedby': showHelperTextElement
          ? (isError ? errorId : helperTextId)
          : '',
        'aria-required': required ? 'true' : 'false',
        'aria-invalid': isError ? 'true' : 'false'
      }
    }
  });

  /*
   * Tiptap is uncontrolled internally (its document lives in ProseMirror
   * state) — only push `value` into the editor when it actually diverges
   * from the editor's own HTML (e.g. an external reset), never on every
   * keystroke, or the cursor position would jump on each `onUpdate`.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }
    const currentHtml = editor.getHTML();
    const nextHtml = value ?? '';
    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!muiDisabled);
  }, [muiDisabled, editor]);

  if (!editor) {
    return null;
  }

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
      <Box
        sx={{
          border: '1px solid',
          borderColor: isError ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          opacity: muiDisabled ? 0.6 : 1,
          '&:focus-within': {
            borderColor: isError ? 'error.main' : 'primary.main',
            borderWidth: '2px',
            m: '-1px'
          }
        }}
      >
        <Toolbar editor={editor} disabled={muiDisabled} />
        <Box
          sx={{
            px: 1.5,
            py: 1,
            minHeight: 160,
            maxHeight: 400,
            overflowY: 'auto',
            '& .ProseMirror': {
              outline: 'none',
              minHeight: 140
            },
            '& .ProseMirror p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
              float: 'left',
              height: 0,
              pointerEvents: 'none'
            }
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
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
};

export { DefaultEditorExtensions };
export default MUITipTapRte;
