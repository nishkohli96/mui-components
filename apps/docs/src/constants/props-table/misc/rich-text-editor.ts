import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUIRichTextEditor`. */
const richTextEditorRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName_NoName,
  P.value_RichTextEditor,
  P.onValueChange_RichTextEditor,
  {
    name: 'editorConfig',
    description:
      'CKEditor configuration passed to `ClassicEditor`. Defaults to this package\'s `DefaultEditorConfig`.',
    type: 'EditorConfig'
  },
  {
    name: 'onReady',
    description: 'Callback fired when the CKEditor instance is ready.',
    type: '(editor: ClassicEditor) => void'
  },
  {
    name: 'onFocus',
    description: 'Callback fired when the CKEditor instance receives focus.',
    type: '(event, editor) => void'
  },
  {
    name: 'onBlur',
    description: 'Callback fired when the CKEditor instance loses focus.',
    type: '(event, editor) => void'
  },
  {
    name: 'onError',
    description:
      'Callback fired when CKEditor reports an initialization or runtime error.',
    type: '(error: Error, details) => void'
  },
  P.required,
  P.label,
  P.showLabelAboveFormField_Default,
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.helperText, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default richTextEditorRows;
