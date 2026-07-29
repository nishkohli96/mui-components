import type { MUIComponentsConfig } from '@/types';

const DefaultStyles = Object.freeze({
  margin: {
    top: '0.25rem',
    bottom: '0.75rem',
    left: 0
  },
});

export const DefaultMUIComponentsConfig: MUIComponentsConfig = {
  defaultFormLabelSx: { mb: DefaultStyles.margin.bottom },
  defaultFormControlLabelSx: {},
  defaultFormHelperTextSx: {
    mt: DefaultStyles.margin.top,
    ml: DefaultStyles.margin.left
  },
};
