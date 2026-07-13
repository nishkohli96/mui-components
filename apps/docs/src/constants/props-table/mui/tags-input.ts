import type { PropsInfo, PropsDescriptionArgs } from '@/types';
import { PropsDescription as P, resolveProp } from '../descriptions';

/** Props reference rows for `MUITagsInput`. */
const tagsInputRows = (args: PropsDescriptionArgs): PropsInfo[] => [
  P.fieldName,
  P.value_TagsInput,
  P.onValueChange_TagsInput,
  P.onTagAdd,
  P.onTagDelete,
  P.onTagPaste,
  P.delimiter,
  P.maxTags_TagsInput,
  P.limitTags_TagsInput,
  P.getLimitTagsText,
  P.renderTagLabel,
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
