import {
  ContentContainer,
  PageHeading,
  SubHeading
} from '@/components';
import { pageMetadata } from '@/constants';
import StyledReusableComponentForm from '@/forms/styled-components/Client';

export const metadata = pageMetadata.customizationExample;

export default function CustomizationPage() {
  return (
    <ContentContainer>
      <PageHeading title={metadata.title as string} />
      <SubHeading title={metadata.description as string} />
      <StyledReusableComponentForm />
    </ContentContainer>
  );
}
