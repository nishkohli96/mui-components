import {
  ContentContainer,
  PageHeading,
  LinksList,
  SubHeading
} from '@/components';
import {
  pageMetadata,
  componentsDocsLink,
  validationLibLinks
} from '@/constants';
import CompleteRHFForm from '@/forms/complete-forms/rhf/Client';

export const metadata = pageMetadata.completeFormZod;

export default function CompleteRHFFormPage() {
  const docsLinks = Object.keys(componentsDocsLink).map(
    k => componentsDocsLink[k]
  );
  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <CompleteRHFForm />
      <LinksList links={[...docsLinks, validationLibLinks.zod]} />
    </ContentContainer>
  );
};
