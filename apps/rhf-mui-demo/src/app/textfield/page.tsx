import Typography from '@mui/material/Typography';
import {
  ContentContainer,
  PageHeading,
  SubHeading,
  Link
} from '@/components';
import {
  CodeBlock,
  DocSection,
  ExampleBlock,
  PropsTable
} from '@/components/docs';
import { pageMetadata } from '@/constants';
import { muiTextFieldProps } from '@/constants/component-props/textfield';
import { readSourceFile } from '@/utils/read-source';
import BasicTextField from '@/forms/textfield/examples/BasicTextField';
import TextFieldsForm from '@/forms/textfield/Client';

export const metadata = pageMetadata.textfield;

const importSnippet
  = "import MUITextField from '@nish1896/mui-components/mui/textfield';";

const usageSnippet = `const [firstName, setFirstName] = useState('');

<MUITextField
  fieldName="firstName"
  value={firstName}
  onValueChange={({ newValue }) => setFirstName(newValue)}
/>`;

const TextFieldPage = () => {
  const basicExampleSource = readSourceFile(
    'src/forms/textfield/examples/BasicTextField.tsx'
  );

  return (
    <ContentContainer>
      <PageHeading title="MUITextField" />
      <SubHeading title={metadata.description as string} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        <code className="doc-inline-code">MUITextField</code>
        {' '}
        extends the Material UI
        {' '}
        <Link
          href="https://mui.com/material-ui/react-text-field/"
          target="_blank"
          rel="noopener noreferrer"
        >
          TextField
        </Link>
        {' '}
        component, accepting almost all of its props while wiring up the label,
        error state and helper text for you. It is a controlled component that
        works with plain
        {' '}
        <code className="doc-inline-code">useState</code>
        {' '}
        or any form library able to provide a value and receive changes.
      </Typography>

      <DocSection id="usage" title="Usage">
        <CodeBlock code={importSnippet} title="Import" />
        <Typography variant="body1" sx={{ mb: 1 }}>
          Provide
          {' '}
          <code className="doc-inline-code">fieldName</code>
          ,
          {' '}
          <code className="doc-inline-code">value</code>
          {' '}
          and
          {' '}
          <code className="doc-inline-code">onValueChange</code>
          {' '}
          to render a fully functional text field:
        </Typography>
        <CodeBlock code={usageSnippet} />
      </DocSection>

      <DocSection id="example" title="Example">
        <ExampleBlock
          description="Required field validated on blur, with value and error kept in component state."
          source={basicExampleSource}
          sourceTitle="BasicTextField.tsx"
        >
          <BasicTextField />
        </ExampleBlock>
      </DocSection>

      <DocSection id="props" title="Props">
        <Typography variant="body1" sx={{ mb: 1 }}>
          <code className="doc-inline-code">MUITextFieldProps</code>
          {' '}
          also accepts the remaining
          {' '}
          <Link
            href="https://mui.com/material-ui/api/text-field/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TextFieldProps
          </Link>
          {' '}
          (variant, placeholder, slotProps, sx, ...) in addition to the props below.
        </Typography>
        <PropsTable rows={muiTextFieldProps} />
      </DocSection>

      <DocSection id="playground" title="Playground">
        <TextFieldsForm />
      </DocSection>
    </ContentContainer>
  );
};

export default TextFieldPage;
