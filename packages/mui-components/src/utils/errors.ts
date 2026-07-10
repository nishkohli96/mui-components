/**
 * Accepted shape of the `errorMessage` prop on every form component — pass
 * whatever your form library reports:
 *
 * - `string` — used as the message (`''` clears the error state)
 * - `Error` or any object with a `message` (RHF `FieldError`, Zod issues,
 *   Yup `ValidationError`, ...) — the message is resolved recursively; an
 *   error object with an empty message still sets the error state
 * - arrays of any of the above (e.g. TanStack `field.state.meta.errors`) —
 *   every resolvable message is kept, so multiple failed rules show together
 * - `false` / `null` / `undefined` / `[]` — no error; `false` is accepted so
 *   the idiomatic `touched && errors` pattern can be passed as-is
 */
export type FieldErrorInput =
  | string
  | false
  | null
  | undefined
  | { message?: unknown }
  | FieldErrorInput[];

export type ParsedErrorInput = {
  /** Whether the field should render in an error state. */
  isError: boolean;
  /** Every message resolved from the input, in order. Empty when none. */
  errorMessages: string[];
};

/**
 * Parses a `FieldErrorInput` into the error state and the list of resolved
 * messages. Used internally by every component; exported for wrapper
 * libraries that need the same semantics.
 */
export function parseErrorInput(error: unknown): ParsedErrorInput {
  if (
    error === null
    || error === undefined
    || error === false
    || error === ''
  ) {
    return { isError: false, errorMessages: [] };
  }
  if (typeof error === 'string') {
    return {
      isError: true,
      errorMessages: error.trim() === '' ? [] : [error]
    };
  }
  if (Array.isArray(error)) {
    const parsedItems = error.map(item => parseErrorInput(item));
    return {
      isError: parsedItems.some(item => item.isError),
      errorMessages: parsedItems.flatMap(item => item.errorMessages)
    };
  }
  if (typeof error === 'object') {
    if ('message' in error) {
      const inner = parseErrorInput((error as { message: unknown }).message);
      return { isError: true, errorMessages: inner.errorMessages };
    }
    return { isError: true, errorMessages: [] };
  }
  // Out-of-contract input from untyped callers (e.g. `true` or a number):
  // truthy still flags the field, but no message text is fabricated from it.
  return { isError: Boolean(error), errorMessages: [] };
}

/**
 * Convenience wrapper over `parseErrorInput` returning only the first
 * resolved message — handy outside the components, e.g. for toasts.
 *
 * @example
 * toErrorMessage(field.state.meta.errors)   // TanStack Form
 * toErrorMessage(fieldState.error)          // React Hook Form
 */
export function toErrorMessage(error: unknown): string | undefined {
  return parseErrorInput(error).errorMessages[0];
}

export function generateLabelValueErrMsg(formElement: string) {
  return `Provide "labelKey" & "valueKey" props in ${formElement} if options are an array of objects.`;
}

export function generateDateAdapterErrMsg(formElement: string) {
  return `Missing "dateAdapter" for ${formElement}. Please wrap your component tree with "ConfigProvider dateAdapter={...}>" to configure it.`;
}

export function generateLargeOptionsErrMsg(
  formElement: string,
  optionsLength: number
) {
  return `[${formElement}]: options length (${optionsLength}) is relatively large. For better performance, searchability, and user experience, consider using RHFAutocomplete or RHFMuiAutocomplete instead.`;
}
