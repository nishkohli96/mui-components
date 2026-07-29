'use client';

import {
  useState,
  useContext,
  useCallback,
  type ReactNode,
  type FocusEvent,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent
} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  FormControl,
  FormLabel,
  FormLabelText,
  FormHelperText,
  defaultAutocompleteValue,
  type FormLabelProps,
  type FormHelperTextProps,
  type MuiChipProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import type { CustomComponentIds } from '@/types';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  fieldNameToId,
  useFieldIds,
  normalizeString,
  getErrorList
} from '@/utils';

type TextFieldInputProps = Omit<
  TextFieldProps,
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'error'
  | 'multiline'
  | 'rows'
  | 'minRows'
  | 'maxRows'
  | 'FormHelperTextProps'
  | 'ref'
>;

type OnValueChangeProps = {
  newValue: string[];
};

type TagsInputOnTagAddProps = {
  currentValue: string[];
  newTag: string;
};

type TagsInputOnTagDeleteProps = {
  currentValue: string[];
  deletedTag: string;
};

type TagsInputOnTagPasteProps = {
  currentValue: string[];
  pastedTags: string[];
};

export type MUITagsInputProps = {
  /**
   * Name/path of the field. Used to derive the `id`, the default label, and the `name` attribute.
   */
  fieldName: string;
  /**
   * Current tags of the field. This is a controlled component: `value` and `onValueChange`
   * must be supplied together, typically backed by your own state or form library.
   *
   * Always an array — `undefined` or `[]` is an empty tag list. Removing the
   * last tag emits `[]`, never `null`, so `newValue` can be fed straight back
   * into `value`.
   */
  value?: string[];
  /**
   * Called with the next tag array after tags are added or removed.
   * Call your state setter (or form library's setter) with `newValue` to update `value`.
   *
   * @param newValue - Next tag string array.
   */
  onValueChange: ({ newValue }: OnValueChangeProps) => void;
  /**
   * Called before a tag is added.
   *
   * Use this callback to validate, transform, or prevent individual tags.
   *
   * Returning:
   * - `false` prevents the tag from being added.
   * - `string` replaces the original tag with the returned value.
   * - `true` or `void` allows the original tag to be added unchanged.
   *
   * @param props - Details for the tag add action.
   * @param props.currentValue - The current field value before the new tag is added.
   * @param props.newTag - The tag the user is attempting to add.
   * @returns `false` to block the tag, a replacement tag string, or nothing to allow the tag.
   */
  onTagAdd?: ({
    currentValue,
    newTag
  }: TagsInputOnTagAddProps) => boolean | string | void;
  /**
   * Called before a tag is removed.
   *
   * Use this callback to intercept or prevent tag deletion.
   *
   * Returning:
   * - `false` prevents the tag from being removed.
   * - `true` or `void` allows the tag to be removed.
   *
   * @param props - Details for the tag delete action.
   * @param props.currentValue - The current field value before the tag is removed.
   * @param props.deletedTag - The tag being removed.
   * @returns `false` to prevent deletion, or nothing to allow it.
   */
  onTagDelete?: ({
    currentValue,
    deletedTag
  }: TagsInputOnTagDeleteProps) => boolean | void;
  /**
   * Called when one or more tags are pasted into the input.
   *
   * Return:
   * - `false` to prevent all pasted tags from being added.
   * - A `string[]` to replace the parsed tags with a custom set.
   * - `void` to use the parsed tags unchanged.
   *
   * Tags are split using the configured `delimiter`, trimmed,
   * and deduplicated before this callback is invoked.
   *
   * @param props - Details for the tag paste action.
   * @param props.currentValue - The current field value before the paste operation.
   * @param props.pastedTags - The parsed tags extracted from the pasted text.
   */
  onTagPaste?: ({
    currentValue,
    pastedTags
  }: TagsInputOnTagPasteProps) => string[] | boolean | void;
  /**
   * Character used to separate tags when typing or pasting.
   *
   * Pressing this key commits the current input as one or more tags.
   * Pasted values are also split using this delimiter.
   *
   * @default ','
   */
  delimiter?: string;
  /**
   * Maximum number of tags that can be added.
   *
   * When the limit is reached:
   * - Additional tags entered from the keyboard are ignored.
   * - Pasted tags are truncated to fit the remaining available slots.
   *
   * By default, no limit is enforced.
   */
  maxTags?: number;
  /**
   * When true, renders the field label above the form field instead of inside or beside it.
   */
  showLabelAboveFormField?: boolean;
  /**
   * Props forwarded to the internal `FormLabel`. The `id` is managed by the component.
   */
  formLabelProps?: Omit<FormLabelProps, 'id'>;
  /**
   * When true, hides the rendered field label while preserving accessible labeling where possible.
   */
  hideLabel?: boolean;
  /**
   * Validation error for the field — pass a single message `string`, or a
   * `string[]` when the field can fail multiple rules at once (every message
   * is shown together).
   *
   * A non-empty string or a non-empty array puts the field into an error state
   * and surfaces the message(s) through `FormHelperText`; `undefined`, `''` or
   * `[]` clear it.
   *
   * Use `renderError` to customize how the message(s) are rendered.
   */
  errorMessage?: string | string[];
  /**
   * Custom renderer for the resolved error message(s), called only when the
   * field is in an error state. Always receives a `string[]` — use `errors[0]`
   * for the common single-message case, or map over `errors` when a field fails
   * several rules.
   *
   * When omitted, a single message renders as plain text and multiple
   * messages render on separate lines.
   *
   * @param errors - Resolved error messages for this field (never empty).
   */
  renderError?: (errors: string[]) => ReactNode;
  /**
   * If true, hides the error message text while keeping the field in an error state.
   */
  hideErrorMessage?: boolean;
  /**
   * Props forwarded to the internal `FormHelperText`. The `id` is managed by the component.
   */
  formHelperTextProps?: Omit<FormHelperTextProps, 'id'>;
  /**
   * Props applied to the Chip component used to render each tag.
   *
   * Useful for customizing the appearance and behavior of tags,
   * such as color, size, variant, icon, or delete functionality.
   */
  ChipProps?: MuiChipProps;
  /**
   * Maximum number of tags shown when the input is not focused.
   *
   * Set to `-1` to always show all tags.
   *
   * @default 2
   */
  limitTags?: number;
  /**
   * Custom label rendered for the hidden tags counter.
   *
   * Receives the number of hidden tags.
   *
   * @default moreTags => `+${moreTags} more`
   */
  getLimitTagsText?: (moreTags: number) => ReactNode;
  /**
   * Custom renderer for each visible tag label.
   *
   * Receives the tag value and should return the content displayed inside the chip.
   */
  renderTagLabel?: (tag: string) => ReactNode;
  /**
   * Custom ids for generated field, label, helper text, and error elements.
   */
  customIds?: CustomComponentIds;
} & TextFieldInputProps;

const MUITagsInput = ({
  fieldName,
  value,
  onValueChange,
  onTagAdd,
  onTagDelete,
  onTagPaste,
  delimiter = ',',
  maxTags,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  required,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  ChipProps,
  sx: muiTextFieldSx,
  variant = 'outlined',
  limitTags = 2,
  getLimitTagsText,
  slotProps: muiSlotProps,
  onFocus,
  onBlur,
  autoComplete = defaultAutocompleteValue,
  renderTagLabel,
  customIds,
  ...otherTagsInputProps
}: MUITagsInputProps) => {
  const muiTheme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { fieldId, labelId, helperTextId, errorId } = useFieldIds(
    fieldName,
    customIds
  );

  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );

  const defaultFieldLabel = fieldNameToLabel(fieldName);
  const fieldLabel = label ?? defaultFieldLabel;
  const accessibleFieldLabel = typeof fieldLabel === 'string'
    ? fieldLabel
    : defaultFieldLabel;

  const tags = value ?? [];

  const errorList = getErrorList(errorMessage);
  const isError = errorList.length > 0;
  const fieldErrorMessage = isError
    ? renderError?.(errorList) ?? (
      errorList.length === 1
        ? errorList[0]
        : errorList.map((message, index) => (
          <div key={index}>
            {message}
          </div>
        ))
    )
    : undefined;
  const showHelperTextElement = !!(helperText || (isError && !hideErrorMessage));

  /**
   * Similar to MuiAutocomplete, if limitTags = -1, show all the
   * tags in the input, even when it is not focused.
   */
  const showAllTags = limitTags === -1;

  const getPaddingOverride = (overrides: unknown): string | undefined => {
    if (
      overrides !== null
      && typeof overrides === 'object'
      && 'padding' in overrides
    ) {
      const { padding } = overrides;
      return typeof padding === 'string' ? padding : undefined;
    }
    return undefined;
  };

  const getTextFieldPadding = (
    variant: 'outlined' | 'filled' | 'standard'
  ): string => {
    switch (variant) {
      case 'filled':
        return (
          getPaddingOverride(
            muiTheme.components?.MuiFilledInput?.styleOverrides?.root
          ) ?? '25px 12px 8px'
        );
      case 'standard':
        return (
          getPaddingOverride(
            muiTheme.components?.MuiInput?.styleOverrides?.root
          ) ?? '4px 0px 5px'
        );
      default:
        return (
          getPaddingOverride(
            muiTheme.components?.MuiOutlinedInput?.styleOverrides?.root
          ) ?? '16.5px 14px'
        );
    }
  };
  const textFieldPadding = getTextFieldPadding(variant);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const triggerChangeEvents = useCallback(
    (newValue: string[]) => {
      onValueChange({ newValue });
    },
    [onValueChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, currentTags: string[]) => {
      const trimmed = inputValue.trim();

      /*  Add tag on pressing "Enter" or the delimiter key. */
      if (event.key === 'Enter' || event.key === delimiter) {
        event.preventDefault();
        if (trimmed) {
          /* Split input by delimiter and filter valid tags */
          const rawTags = trimmed
            .split(delimiter)
            .map(tag => tag.trim())
            .filter(Boolean);
          if (!rawTags.length) {
            return;
          }

          /* Allow external hook to modify or block additions */
          const processedTags: string[] = [];
          for (const tag of rawTags) {
            /* Check if max limit reached */
            if (
              maxTags !== undefined
              && currentTags.length + processedTags.length >= maxTags
            ) {
              break;
            }
            const result = onTagAdd?.({
              currentValue: currentTags,
              newTag: tag
            });
            if (result !== false) {
              const finalTag = (
                typeof result === 'string' ? result : tag
              ).trim();
              if (
                ![...currentTags, ...processedTags].some(
                  v => normalizeString(v) === normalizeString(finalTag)
                )
              ) {
                processedTags.push(finalTag);
              }
            }
          }

          if (processedTags.length) {
            triggerChangeEvents([...currentTags, ...processedTags]);
            setInputValue('');
          }
        }
      } else if (!trimmed && ['Backspace', 'Delete'].includes(event.key)) {
        /**
         * Guard against empty array — currentTags[currentTags.length - 1] is
         * undefined when there are no tags, which would pass undefined to
         * onTagDelete and slice an already-empty array unnecessarily.
         */
        if (!currentTags.length) {
          return;
        }

        const deletedTag = currentTags[currentTags.length - 1];
        const shouldDelete = onTagDelete?.({
          currentValue: currentTags,
          deletedTag
        });
        if (shouldDelete === false) {
          return;
        }
        triggerChangeEvents(currentTags.slice(0, -1));
      }
    },
    [inputValue, delimiter, maxTags, onTagAdd, onTagDelete, triggerChangeEvents]
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>, currentTags: string[]) => {
      event.preventDefault();
      const pasteData = event.clipboardData.getData('text');

      /**
       * Use reduce instead of filter so each candidate tag is also
       * checked against the tags already accepted from the same paste batch.
       * Previously "foo,foo" would pass the filter twice because neither
       * occurrence existed in the current tags at filter time.
       */
      const newTags = pasteData
        .split(delimiter)
        .map(tag => tag.trim())
        .filter(Boolean)
        .reduce<string[]>((acc, tag) => {
          const norm = normalizeString(tag);
          if (
            !currentTags.some(v => normalizeString(v) === norm)
            && !acc.some(v => normalizeString(v) === norm)
          ) {
            acc.push(tag);
          }
          return acc;
        }, []);

      const result = onTagPaste?.({
        currentValue: currentTags,
        pastedTags: newTags
      });
      if (result === false) {
        return;
      }

      const finalTags = Array.isArray(result) ? result : newTags;

      if (maxTags !== undefined) {
        const remainingSlots = Math.max(maxTags - currentTags.length, 0);
        if (remainingSlots === 0) {
          return;
        }
        if (finalTags.length > 0) {
          triggerChangeEvents([
            ...currentTags,
            ...finalTags.slice(0, remainingSlots)
          ]);
        }
        return;
      }

      if (finalTags.length > 0) {
        triggerChangeEvents([...currentTags, ...finalTags]);
      }
    },
    [delimiter, maxTags, onTagPaste, triggerChangeEvents]
  );

  const hideInput = muiDisabled && tags.length > 0;

  const visibleTags = showAllTags || isFocused
    ? tags
    : tags.slice(0, limitTags);
  const moreTags = tags.length - limitTags;

  const startAdornment = (
    <Box
      role="list"
      /**
       * Without this, a chip click first fires `mousedown` on the input,
       * blurring it and flipping `isFocused` to false — which recomputes
       * `visibleTags` down to `limitTags` before the chip's `onDelete`
       * click handler runs, so the clicked chip shifts or unmounts and
       * never gets deleted. Suppressing the default mousedown behavior
       * keeps the input focused; `onDelete` still fires on click.
       */
      onMouseDown={event => event.preventDefault()}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: tags.length > 0 && !hideInput ? 1 : 0,
        width: '100%'
      }}
    >
      {visibleTags.map((tag, index) => (
        <Chip
          {...ChipProps}
          key={`${fieldNameToId(tag)}-${index}`}
          id={`${fieldNameToId(tag)}-${index}`}
          role="listitem"
          label={renderTagLabel?.(tag) ?? tag}
          disabled={muiDisabled}
          onDelete={() => {
            const shouldDelete = onTagDelete?.({
              currentValue: tags,
              deletedTag: tag
            });
            if (shouldDelete === false) {
              return;
            }
            triggerChangeEvents(tags.filter(t => t !== tag));
          }}
        />
      ))}
      {!showAllTags && !isFocused && tags.length > limitTags && (
        <Chip
          {...ChipProps}
          id={`${fieldNameToId(fieldName)}-more`}
          role="listitem"
          label={
            getLimitTagsText?.(moreTags)
            ?? `+${moreTags} more`
          }
          disabled={muiDisabled}
        />
      )}
    </Box>
  );

  return (
    <FormControl error={isError} disabled={muiDisabled}>
      {!hideLabel && (
        <FormLabel
          label={fieldLabel}
          isVisible={isLabelAboveFormField}
          required={required}
          error={isError}
          disabled={muiDisabled}
          formLabelProps={{
            ...formLabelProps,
            id: labelId,
            htmlFor: fieldId
          }}
        />
      )}
      <MuiTextField
        {...otherTagsInputProps}
        id={fieldId}
        name={fieldName}
        type="text"
        autoComplete={autoComplete}
        variant={variant}
        label={
          !hideLabel && !isLabelAboveFormField
            ? (
              <FormLabelText label={fieldLabel} required={required} />
            )
            : undefined
        }
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={event => handleKeyDown(event, tags)}
        onPaste={event => handlePaste(event, tags)}
        onFocus={handleFocus}
        onBlur={e => {
          setIsFocused(false);
          /**
           * Clear uncommitted input on blur so stale text
           * doesn't reappear the next time the field is focused.
           */
          setInputValue('');
          onBlur?.(e);
        }}
        disabled={muiDisabled}
        error={isError}
        sx={{
          ...muiTextFieldSx,
          '& .MuiInputBase-root': {
            display: 'flex',
            flexDirection: 'column',
            padding: textFieldPadding
          },
          '& .MuiInputBase-input': {
            padding: 0,
            ...(hideInput && { display: 'none' })
          }
        }}
        slotProps={{
          ...muiSlotProps,
          input: { ...muiSlotProps?.input, startAdornment },
          htmlInput: {
            ...muiSlotProps?.htmlInput,
            'aria-labelledby':
              !hideLabel && isLabelAboveFormField ? labelId : undefined,
            'aria-label': hideLabel ? accessibleFieldLabel : undefined,
            'aria-describedby': showHelperTextElement
              ? isError
                ? errorId
                : helperTextId
              : undefined,
            'aria-required': required,
          }
        }}
        multiline={false}
      />
      <FormHelperText
        error={isError}
        errorMessage={fieldErrorMessage}
        hideErrorMessage={hideErrorMessage}
        helperText={helperText}
        showHelperTextElement={showHelperTextElement}
        formHelperTextProps={{
          ...formHelperTextProps,
          id: isError ? errorId : helperTextId
        }}
      />
    </FormControl>
  );
};

export default MUITagsInput;
