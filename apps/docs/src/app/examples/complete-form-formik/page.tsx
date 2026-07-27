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
import CompleteFormikForm from '@/forms/complete-forms/formik/Client';

export const metadata = pageMetadata.completeFormFormik;

export default function CompleteFormikFormPage() {
  const docsLinks = Object.keys(componentsDocsLink).map(
    k => componentsDocsLink[k]
  );

  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <CompleteFormikForm />
      <LinksList links={docsLinks} />
    </ContentContainer>
  );
};
