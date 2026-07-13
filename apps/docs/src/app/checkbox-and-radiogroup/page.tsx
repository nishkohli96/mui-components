import { ContentContainer, LinksList, PageHeading, SubHeading } from '@/components';
import {
  pageMetadata,
  componentsDocsLink,
  validationLibLinks
} from '@/constants';
import CheckboxRadioClient from '@/forms/checkbox-and-radiogroup-with-zod/Client';

export const metadata = pageMetadata.checkboxAndRadio;

const CheckboxRadioZodFormPage = () => {
  const docsLinks = [
    componentsDocsLink.rhfCheckbox,
    componentsDocsLink.rhfCheckboxGroup,
    componentsDocsLink.rhfRadioGroup,
    validationLibLinks.zod
  ];

  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string}/>
      <CheckboxRadioClient />
      <LinksList links={docsLinks} />
    </ContentContainer>
  );
};

export default CheckboxRadioZodFormPage;
