import type { ReactNode, Ref } from 'react';

/**
 * Whether the shared `FormLabel` should render above a control that already
 * has an inline (floating) label, e.g. `TextField`. The label stays inside the
 * field unless asked otherwise.
 *
 * Precedence: `showLabelAboveFormField` (prop) → `allLabelsAboveFields` (config)
 * → `false`. The prop wins, so a field can opt out (`false`) even when the
 * config places every label above its field.
 */
export function keepLabelAboveFormField(
  showLabelAboveFormField?: boolean,
  allLabelsAboveFields?: boolean
) {
  return Boolean(showLabelAboveFormField ?? allLabelsAboveFields);
}

/**
 * Whether the shared `FormLabel` should render above the control.
 * For components with **no** built-in label (e.g. `NativeSelect`, `Rating`), the
 * default is to show the label above unless overridden.
 *
 * Precedence: `showLabelAboveFormField` (prop) → `allLabelsAboveFields` (config) → `true`.
 * The prop wins, so a field can opt out (`false`) even when the config places
 * every label above its field.
 *
 * Contrast with `keepLabelAboveFormField`, which defaults to `false` for controls
 * that already provide a floating/integrated label (e.g. `TextField`).
 */
export function resolveLabelAboveControl(
  showLabelAboveFormField?: boolean,
  allLabelsAboveFields?: boolean
): boolean {
  return showLabelAboveFormField ?? allLabelsAboveFields ?? true;
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref).current = value;
      }
    });
  };
}

/**
 * Whether a `ReactNode` renders anything. Unlike a truthiness check, the number
 * `0` counts as content, so `helperText={0}` is shown.
 */
export function hasContent(node: ReactNode): boolean {
  return (
    node !== undefined && node !== null
    && node !== false && node !== true
    && node !== ''
  );
}
