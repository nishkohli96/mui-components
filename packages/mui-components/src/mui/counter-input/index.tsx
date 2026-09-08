'use client';

import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode
} from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { IconButtonProps } from '@/common';
import {
  setInputValueAndNotify,
  getSteppedInputValue,
  resolveMinBound,
  resolveStepAmount
} from '@/utils';
import MUINumberInput, { type MUINumberInputProps } from '../number-input';

export type MUICounterInputProps = Omit<MUINumberInputProps, 'showMarkers'> & {
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
   * When true, the increment icon renders on the left (decrement) button and
   * vice versa. Accessible labels and behaviour are unchanged — the left
   * button still decreases the value.
   */
  swapIcons?: boolean;
  /**
   * Props forwarded to both internal stepper `IconButton`s. Use
   * `decrementIcon`/`incrementIcon` to swap the icons themselves; this is for
   * the buttons around them — e.g. a custom `size` or `sx`.
   */
  iconButtonProps?: IconButtonProps;
};

/**
 * `MUINumberInput` with always-visible `-` / `+` stepper buttons flanking the
 * input instead of the native browser steppers. All numeric behaviour —
 * `value` as `number | null`, `onlyIntegers`, `nonNegative`, `maxDecimalPlaces`,
 * `stepAmount`, `min` / `max` clamping, validation, labelling — is delegated to
 * `MUINumberInput`; this component only adds the buttons and disables the
 * relevant one when its `min` / `max` bound is reached.
 *
 * Docs: [MUICounterInput](https://mui-components-docs.vercel.app/components/mui/counter-input)
 *
 * API: [MUICounterInputProps](https://mui-components-docs.vercel.app/components/mui/counter-input#api)
 */
const MUICounterInput = ({
  value: muiValue,
  disabled: muiDisabled,
  onlyIntegers = false,
  nonNegative = false,
  min,
  max,
  stepAmount = 1,
  decrementIcon,
  incrementIcon,
  swapIcons,
  iconButtonProps,
  sx: muiSx,
  slotProps: muiSlotProps,
  ...otherNumberInputProps
}: MUICounterInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedStepAmount = resolveStepAmount(stepAmount, onlyIntegers);
  const effectiveMin = resolveMinBound(nonNegative, min);

  const atMin = effectiveMin !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue <= effectiveMin;
  const atMax = max !== undefined
    && muiValue !== null
    && muiValue !== undefined
    && muiValue >= max;

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

  const decrementButton = (
    <InputAdornment position="start">
      <IconButton
        {...iconButtonProps}
        type="button"
        edge="start"
        size={iconButtonProps?.size ?? 'small'}
        aria-label="Decrease value"
        disabled={!!muiDisabled || atMin}
        onClick={() => stepBy(-1)}
        onMouseDown={keepInputFocused}
      >
        {swapIcons ? addButtonIcon : removeButtonIcon}
      </IconButton>
    </InputAdornment>
  );

  const incrementButton = (
    <InputAdornment position="end">
      <IconButton
        {...iconButtonProps}
        type="button"
        edge="end"
        size={iconButtonProps?.size ?? 'small'}
        aria-label="Increase value"
        disabled={!!muiDisabled || atMax}
        onClick={() => stepBy(1)}
        onMouseDown={keepInputFocused}
      >
        {swapIcons ? removeButtonIcon : addButtonIcon}
      </IconButton>
    </InputAdornment>
  );

  return (
    <MUINumberInput
      {...otherNumberInputProps}
      value={muiValue}
      disabled={muiDisabled}
      onlyIntegers={onlyIntegers}
      nonNegative={nonNegative}
      min={min}
      max={max}
      showMarkers={false}
      stepAmount={stepAmount}
      inputRef={inputRef}
      sx={{
        ...muiSx,
        '& input[type=number]': { textAlign: 'center' }
      }}
      slotProps={{
        ...muiSlotProps,
        input: {
          ...muiSlotProps?.input,
          startAdornment: (
            <>
              {(muiSlotProps?.input as { startAdornment?: ReactNode })?.startAdornment}
              {decrementButton}
            </>
          ),
          endAdornment: (
            <>
              {(muiSlotProps?.input as { endAdornment?: ReactNode })?.endAdornment}
              {incrementButton}
            </>
          )
        }
      }}
    />
  );
};

export default MUICounterInput;
