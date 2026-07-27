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
import CompleteTanStackForm from '@/forms/complete-forms/tanstack/Client';

export const metadata = pageMetadata.completeFormTanStack;

export default function CompleteTanStackFormPage() {
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
