import {
  ContentContainer,
  PageHeading,
  LinksList,
  SubHeading
} from '@/components';
import {
  pageMetadata,
  componentsDocsLink
} from '@/constants';
import CompleteStateForm from '@/forms/complete-forms/state/Client';

export const metadata = pageMetadata.completeFormState;

export default function CompleteStateFormPage () {
  const docsLinks = Object.keys(componentsDocsLink).map(
    k => componentsDocsLink[k]
  );

  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <CompleteStateForm />
      <LinksList links={docsLinks} />
    </ContentContainer>
  );
};
