import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUITagsInput`. */
const tagsInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_TagsInput,
  P.onValueChange_TagsInput,
  {
    name: 'onTagAdd',
    description:
      'Called before a tag is added. Return `false` to block the tag, a replacement string to transform it, or nothing to allow it unchanged.',
    type: '({ currentValue, newTag }) => boolean | string | void'
  },
  {
    name: 'onTagDelete',
    description:
      'Called before a tag is removed. Return `false` to prevent deletion.',
    type: '({ currentValue, deletedTag }) => boolean | void'
  },
  {
    name: 'onTagPaste',
    description:
      'Called when tags are pasted. Return `false` to reject all, a `string[]` to replace the parsed tags, or nothing to use them unchanged. Tags are split by `delimiter`, trimmed, and deduplicated before this callback.',
    type: '({ currentValue, pastedTags }) => string[] | boolean | void'
  },
  {
    name: 'delimiter',
    description:
      'Character used to separate tags when typing or pasting. Pressing this key commits the current input as one or more tags.\n\n**Default:** `\',\'`',
    type: 'string'
  },
  {
    name: 'maxTags',
    description:
      'Maximum number of tags that can be added. Keyboard entries beyond the limit are ignored; pasted tags are truncated to fit.',
    type: 'number'
  },
  {
    name: 'limitTags',
    description:
      'Maximum number of tags shown when the input is not focused. Set to `-1` to always show all tags.\n\n**Default:** `2`',
    type: 'number'
  },
  P.getLimitTagsText,
  {
    name: 'renderTagLabel',
    description:
      'Custom renderer for each visible tag label. Receives the tag value and returns the content displayed inside the chip.',
    type: '(tag: string) => ReactNode'
  },
  resolveProp(P.ChipProps, args),
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  resolveProp(P.showLabelAboveFormField, args),
  P.hideLabel,
  resolveProp(P.formLabelProps, args),
  resolveProp(P.formHelperTextProps, args),
  P.customIds
];

export default tagsInputRows;
