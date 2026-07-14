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
import CompleteStateForm from '@/forms/complete-forms/StateFormClient';

export const metadata = pageMetadata.completeFormState;

const CompleteFormStatePage = () => {
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

export default CompleteFormStatePage;
