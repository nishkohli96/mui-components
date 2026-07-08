import {
	ContentContainer,
	PageHeading,
	SubHeading
} from '@/components';
import { pageMetadata } from '@/constants';
import TextFieldsForm from '@/forms/textfield/Client';

export const metadata = pageMetadata.inputs;

const TextFieldPage = () => {
	return (
		<ContentContainer>
			<PageHeading title={metadata.title as string} />
			<SubHeading title={metadata.description as string} />
			<TextFieldsForm />
		</ContentContainer>
	);
};

export default TextFieldPage;
