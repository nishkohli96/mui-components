'use client';

import {
  useCallback,
  useContext,
  useRef,
  type MouseEvent,
  type ReactNode
} from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  type IconButtonProps
} from '@/common';
import { MUIComponentsConfigContext } from '@/config/ConfigProvider';
import {
  fieldNameToLabel,
  keepLabelAboveFormField,
  setInputValueAndNotify,
  getSteppedInputValue,
  resolveBounds,
  resolveStepAmount,
  useFieldIds,
  getErrorList
} from '@/utils';
import MUINumberInput, { type MUINumberInputProps } from '../number-input';

export type MUICounterInputProps = Omit<MUINumberInputProps, 'showMarkers' | 'variant'> & {
  /**
   * Custom icon for the decrement (`-`) button.
   *
   * @default Remove icon
   */
  decrementIcon?: ReactNode;
  /**
   * Custom icon for the increment (`+`) button.
   *
   * @default Add icon
   */
  incrementIcon?: ReactNode;
  /**
   * Swap both the icons and the behaviour of the two buttons — the left
   * button increments and the right button decrements.
   */
  swapButtons?: boolean;
  /**
   * Props forwarded to both the decrement and increment `IconButton`s.
   */
  iconButtonProps?: IconButtonProps;
  /**
   * Content rendered under the value (e.g. an icon + "Bedrooms" label).
   */
  caption?: ReactNode;
};

/**
 * `MUINumberInput` with always-visible `-` / `+` stepper buttons flanking the
 * input instead of the native browser steppers.
 *
 * Numeric parsing, sanitization and clamping are all delegated to `MUINumberInput`
 * (rendered borderless inside the pill). This component only owns the pill container,
 * the buttons and the optional unit caption.
 *
 * Docs: [MUICounterInput](https://mui-components-docs.vercel.app/components/mui/counter-input)
 *
 * API: [MUICounterInputProps](https://mui-components-docs.vercel.app/components/mui/counter-input#api)
 */
const MUICounterInput = ({
  fieldName,
  value: muiValue,
  disabled: muiDisabled,
  label,
  showLabelAboveFormField,
  formLabelProps,
  hideLabel,
  onlyIntegers = false,
  nonNegative = false,
  min,
  max,
  stepAmount = 1,
  errorMessage,
  renderError,
  hideErrorMessage,
  helperText,
  formHelperTextProps,
  customIds,
  required,
  decrementIcon,
  incrementIcon,
  swapButtons,
  iconButtonProps,
  caption,
  sx: muiSx,
  slotProps: muiSlotProps,
  ...otherNumberInputProps
}: MUICounterInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    fieldId,
    labelId,
    helperTextId,
    errorId
  } = useFieldIds(fieldName, customIds);

  const { allLabelsAboveFields } = useContext(MUIComponentsConfigContext);
  const isLabelAboveFormField = keepLabelAboveFormField(
    showLabelAboveFormField,
    allLabelsAboveFields
  );
  const fieldLabel = label ?? fieldNameToLabel(fieldName);

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

  const resolvedStepAmount = resolveStepAmount(stepAmount, onlyIntegers);
  const {
    min: effectiveMin,
    max: effectiveMax
  } = resolveBounds(nonNegative, min, max);

  const atMin = effectiveMin !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue <= effectiveMin;
  const atMax = effectiveMax !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue >= effectiveMax;

  const stepBy = useCallback(
    (direction: 1 | -1) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      input.focus();
      setInputValueAndNotify(
        input,
        getSteppedInputValue(
          input,
          resolvedStepAmount,
          direction,
          { nonNegative, min, max }
        )
      );
    },
    [max, min, nonNegative, resolvedStepAmount]
  );

  const keepInputFocused = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    },
    []
  );

  const removeButtonIcon = decrementIcon ?? <RemoveIcon fontSize="small" />;
  const addButtonIcon = incrementIcon ?? <AddIcon fontSize="small" />;
  const hasCaption = !!caption;

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: isError ? 'error.main' : 'divider',
          /**
           * Sets a corner radius bigger than half the element's own
           * height/width. Since a rounded corner can never curve past
           * a semicircle, the browser clamps it to the max possible
           * — height÷2.
           */
          borderRadius: '9999px',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          '&:focus-within': {
            borderColor: isError ? 'error.main' : 'primary.main',
            borderWidth: '2px',
            m: '-1px'
          },
          ...muiSx
        }}
      >
        <IconButton
          {...iconButtonProps}
          type="button"
          size={iconButtonProps?.size ?? 'small'}
          aria-label={swapButtons ? 'Increase value' : 'Decrease value'}
          disabled={!!muiDisabled || (swapButtons ? atMax : atMin)}
          onClick={() => stepBy(swapButtons ? 1 : -1)}
          onMouseDown={keepInputFocused}
          sx={{
            borderRadius: 0,
            flexShrink: 0,
            ...iconButtonProps?.sx
          }}
        >
          {swapButtons ? addButtonIcon : removeButtonIcon}
        </IconButton>

        <Box
          sx={{ position: 'relative', flex: 1, minWidth: 0 }}
          onClick={() => inputRef.current?.focus()}
        >
          <MUINumberInput
            {...otherNumberInputProps}
            fieldName={fieldName}
            value={muiValue}
            disabled={muiDisabled}
            onlyIntegers={onlyIntegers}
            nonNegative={nonNegative}
            min={min}
            max={max}
            showMarkers={false}
            stepAmount={stepAmount}
            required={required}
            customIds={customIds}
            inputRef={inputRef}
            hideLabel
            hideErrorMessage
            variant="standard"
            slotProps={{
              ...muiSlotProps,
              input: ownerState => {
                const externalInputProps = typeof muiSlotProps?.input === 'function'
                  ? muiSlotProps.input(ownerState)
                  : muiSlotProps?.input;
                return {
                  ...externalInputProps,
                  disableUnderline: true
                };
              }
            }}
            sx={{
              '& input[type=number]': {
                textAlign: 'center',
                ...(hasCaption ? { paddingBottom: '18px' } : {}),
                ...(muiSx as Record<string, object> | undefined)?.['& input[type=number]']
              }
            }}
          />
          {hasCaption && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 11,
                lineHeight: 1,
                color: 'text.secondary',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {caption}
            </Box>
          )}
        </Box>

        <IconButton
          {...iconButtonProps}
          type="button"
          size={iconButtonProps?.size ?? 'small'}
          aria-label={swapButtons ? 'Decrease value' : 'Increase value'}
          disabled={!!muiDisabled || (swapButtons ? atMin : atMax)}
          onClick={() => stepBy(swapButtons ? -1 : 1)}
          onMouseDown={keepInputFocused}
          sx={{
            borderRadius: 0,
            flexShrink: 0,
            ...iconButtonProps?.sx
          }}
        >
          {swapButtons ? removeButtonIcon : addButtonIcon}
        </IconButton>
      </Box>
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

export default MUICounterInput;
