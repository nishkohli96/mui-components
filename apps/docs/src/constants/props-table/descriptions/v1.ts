/**
 * Props description for v1
 */

import type { MuiPropsDescriptionArgs } from '@/types';
import { getMuiDocsUrl } from '@/utils';

export const PropsDescription_v1 = Object.freeze({
  iconButtonProps: (args: MuiPropsDescriptionArgs) => ({
    name: 'iconButtonProps',
    description: `[IconButtonProps](${getMuiDocsUrl(args.muiVersion)}/api/icon-button/) forwarded to the internal show/hide toggle \`IconButton\` — custom \`size\`, \`sx\`, etc. The interaction/accessibility essentials (\`type\`, \`onClick\`, \`onMouseDown\`, \`edge\`, \`disabled\`, \`aria-label\`) are controlled by the component. Added in \`v1.1\`.`,
    type: `[IconButtonProps](${getMuiDocsUrl(args.muiVersion)}/api/icon-button/)`,
    hasLinkInType: true
  })
});
