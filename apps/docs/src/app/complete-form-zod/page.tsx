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
import CompleteFormWithZod from '@/forms/complete-form-with-zod/Client';

export const metadata = pageMetadata.completeFormZod;

const CompleteFormWithZodPage = () => {
  const docsLinks = Object.keys(componentsDocsLink).map(
    k => componentsDocsLink[k]
  );
  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <CompleteFormWithZod />
      <LinksList links={[...docsLinks, validationLibLinks.zod]} />
    </ContentContainer>
  );
};

export default CompleteFormWithZodPage;
