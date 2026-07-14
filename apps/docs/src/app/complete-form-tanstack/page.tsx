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
import CompleteTanStackForm from '@/forms/complete-forms/TanStackFormClient';

export const metadata = pageMetadata.completeFormTanStack;

const CompleteFormTanStackPage = () => {
  const docsLinks = Object.keys(componentsDocsLink).map(
    k => componentsDocsLink[k]
  );

  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <CompleteTanStackForm />
      <LinksList links={docsLinks} />
    </ContentContainer>
  );
};

export default CompleteFormTanStackPage;
