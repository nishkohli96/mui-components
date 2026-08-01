import { type MouseEvent } from 'react';

export function setInputValueAndNotify(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  );
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function getSteppedInputValue(
  input: HTMLInputElement,
  step: number,
  direction: 1 | -1,
  nonNegative: boolean
) {
  const currentValue = Number(input.value);
  const resolvedValue = Number.isNaN(currentValue)
    ? 0
    : currentValue;
  const nextValue = resolvedValue + (step * direction);
  return String(nonNegative ? Math.max(0, nextValue) : nextValue);
}

export function isNativeNumberMarkerClick(
  input: HTMLInputElement,
  event: MouseEvent
) {
  const rect = input.getBoundingClientRect();
  const markerWidth = Math.min(24, rect.width);

  return event.clientX >= rect.right - markerWidth;
}

/**
 * Builds a pattern for in-progress typing: optional leading `-` when
 * `nonNegative` is false; digits; optional decimal with length limit.
 * @param nonNegative - When `true`, only non-negative values (including 0) match
 *   while typing. When `false` or omitted, `-` and negative numbers are allowed.
 * @param onlyIntegers - When `true`, decimal values are blocked.
 * @param maxDecimalPlaces - The maximum number of decimal places allowed.
 * @returns A RegExp pattern for in-progress typing.
 */
export function buildNumberInputDecimalPattern(
  nonNegative: boolean,
  onlyIntegers: boolean,
  maxDecimalPlaces?: number,
): RegExp {
  const sign = nonNegative ? '' : '-?';
  if (onlyIntegers) {
    return new RegExp(`^${sign}\\d+$`);
  }
  if (maxDecimalPlaces !== undefined) {
    const n = Math.max(0, Math.floor(maxDecimalPlaces));
    return new RegExp(`^${sign}\\d*(\\.\\d{0,${n}})?$`);
  }
  return new RegExp(`^${sign}\\d*(\\.\\d*)?$`);
}

/**
 * Strips/truncates pasted text to fit the active numeric constraints.
 * Returns `null` when nothing salvageable remains.
 *
 * @example
 * sanitizePastedNumber('43.234', false, true)      // '43'   (onlyIntegers)
 * sanitizePastedNumber('-43.5', true,  false)      // '43.5' (nonNegative strips '-')
 * sanitizePastedNumber('3.14159', false, false, 2) // '3.14' (maxDecimalPlaces=2)
 * sanitizePastedNumber('-3.999', false, true)      // '-3'   (both sign + integer)
 */
export function sanitizePastedNumber(
  raw: string,
  nonNegative: boolean,
  onlyIntegers: boolean,
  maxDecimalPlaces?: number,
): string | null {
  let s = raw.trim();
  if (!s) {
    return null;
  }

  /* Preserve sign only when negatives are allowed */
  let sign = '';
  if (s.startsWith('-')) {
    if (!nonNegative) {
      sign = '-';
    }
    s = s.slice(1);
  }

  /* Strip everything except digits and the first decimal point */
  s = s.replace(/[^0-9.]/g, '');
  const firstDot = s.indexOf('.');
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  }

  if (onlyIntegers) {
    s = s.split('.')[0];
  } else if (maxDecimalPlaces !== undefined) {
    const n = Math.max(0, Math.floor(maxDecimalPlaces));
    const [intPart, decPart] = s.split('.');
    s = decPart !== undefined
      ? intPart + (n > 0 ? `.${decPart.slice(0, n)}` : '')
      : intPart;
  }

  /* Strip trailing dot — paste should never leave an in-progress state */
  s = (sign + s).replace(/\.$/, '');
  return s || null;
}
