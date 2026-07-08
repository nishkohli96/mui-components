import type { PropDoc } from '@/types';

/**
 * API reference rows for `MUITextField`, mirroring `MUITextFieldProps` in
 * packages/mui-components/src/mui/textfield/index.tsx. Update both together.
 */
export const muiTextFieldProps: PropDoc[] = [
  {
    name: 'fieldName',
    type: 'string',
    required: true,
    description: (
      <>
        Name/path of the field. Used to derive the{' '}
        <code className="doc-inline-code">id</code>, the default label, and the{' '}
        <code className="doc-inline-code">name</code> attribute.
      </>
    )
  },
  {
    name: 'value',
    type: 'string | null',
    description: (
      <>
        Current value of the field. This is a controlled component —{' '}
        <code className="doc-inline-code">value</code> and{' '}
        <code className="doc-inline-code">onValueChange</code> must be supplied
        together, typically backed by your own state or form library.{' '}
        <code className="doc-inline-code">undefined</code>/
        <code className="doc-inline-code">null</code> are treated as an empty string.
      </>
    )
  },
  {
    name: 'onValueChange',
    type: '({ newValue, event }) => void',
    required: true,
    description: (
      <>
        Called on every input change with the next string value and the original
        change event. Call your state setter (or form library&apos;s setter) with{' '}
        <code className="doc-inline-code">newValue</code> to update{' '}
        <code className="doc-inline-code">value</code>.
      </>
    )
  },
  {
    name: 'errorMessage',
    type: 'string | null',
    description: (
      <>
        Error message for the field. Any non-empty string puts the field into an
        error state and is shown as the helper text. Pass{' '}
        <code className="doc-inline-code">undefined</code> or{' '}
        <code className="doc-inline-code">null</code> to clear the error state.
      </>
    )
  },
  {
    name: 'renderError',
    type: '(error: string) => ReactNode',
    description: (
      <>
        Custom renderer for <code className="doc-inline-code">errorMessage</code>.
        Receives the raw error string and must return renderable content, e.g.
        wrapping it with an icon or a styled element.
      </>
    )
  },
  {
    name: 'hideErrorMessage',
    type: 'boolean',
    description:
      'If true, hides the error message text while keeping the field in an error state.'
  },
  {
    name: 'showLabelAboveFormField',
    type: 'boolean',
    description:
      'When true, renders the field label above the form field instead of inside or beside it.'
  },
  {
    name: 'hideLabel',
    type: 'boolean',
    description:
      'When true, hides the rendered field label while preserving accessible labeling where possible.'
  },
  {
    name: 'formLabelProps',
    type: "Omit<FormLabelProps, 'id'>",
    description: (
      <>
        Props forwarded to the internal{' '}
        <code className="doc-inline-code">FormLabel</code>. The{' '}
        <code className="doc-inline-code">id</code> is managed by the component.
      </>
    )
  },
  {
    name: 'formHelperTextProps',
    type: "Omit<FormHelperTextProps, 'id'>",
    description: (
      <>
        Props forwarded to the internal{' '}
        <code className="doc-inline-code">FormHelperText</code>. The{' '}
        <code className="doc-inline-code">id</code> is managed by the component.
      </>
    )
  },
  {
    name: 'customIds',
    type: 'CustomComponentIds',
    description:
      'Custom ids for generated field, label, helper text, and error elements.'
  }
];
