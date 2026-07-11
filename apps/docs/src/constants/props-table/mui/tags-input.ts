import type { PropsInfo } from '@/types';
import { PropsDescription as P } from '../descriptions';

/** Props reference rows for `MUITagsInput`. */
const tagsInputRows: PropsInfo[] = [
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
      'Character used to separate tags when typing or pasting. Pressing this key commits the current input as one or more tags.',
    type: 'string',
    defaultValue: '\',\''
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
      'Maximum number of tags shown when the input is not focused. Set to `-1` to always show all tags.',
    type: 'number',
    defaultValue: '2'
  },
  P.getLimitTagsText,
  {
    name: 'renderTagLabel',
    description:
      'Custom renderer for each visible tag label. Receives the tag value and returns the content displayed inside the chip.',
    type: '(tag: string) => ReactNode'
  },
  P.ChipProps,
  P.errorMessage,
  P.renderError,
  P.hideErrorMessage,
  P.showLabelAboveFormField,
  P.hideLabel,
  P.formLabelProps,
  P.formHelperTextProps,
  P.customIds
];

export default tagsInputRows;
