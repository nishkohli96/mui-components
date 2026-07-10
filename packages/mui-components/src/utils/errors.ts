/**
 * Normalizes an error of any shape into the `string | undefined` expected by
 * every component's `errorMessage` prop.
 *
 * Form libraries report errors in different shapes — React Hook Form uses a
 * `FieldError` object, TanStack Form an array (of strings, or of objects when
 * a schema adapter like Zod is used), Formik/Yup strings or `ValidationError`s.
 * Passing those shapes to `errorMessage` directly would either always render
 * the field in an error state (`!!object === true`) or print `[object Object]`.
 *
 * Handled shapes:
 * - `string` — returned as-is (empty/whitespace-only → `undefined`)
 * - `number` — stringified
 * - `boolean` / `null` / `undefined` — `undefined` (no message to show)
 * - `Error` or any object with a `message` property (e.g. RHF `FieldError`,
 *   Zod issues, Yup `ValidationError`) — resolved from `message`, recursively
 * - arrays — first entry that resolves to a message (e.g. TanStack `meta.errors`)
 *
 * @example
 * errorMessage={toErrorMessage(field.state.meta.errors)}   // TanStack Form
 * errorMessage={toErrorMessage(fieldState.error)}          // React Hook Form
 * errorMessage={toErrorMessage(touched.email && errors.email)} // Formik
 */
export function toErrorMessage(error: unknown): string | undefined {
  if (error === null || error === undefined || typeof error === 'boolean') {
    return undefined;
  }
  if (typeof error === 'string') {
    return error.trim() === '' ? undefined : error;
  }
  if (typeof error === 'number') {
    return String(error);
  }
  if (Array.isArray(error)) {
    for (const item of error) {
      const message = toErrorMessage(item);
      if (message !== undefined) {
        return message;
      }
    }
    return undefined;
  }
  if (typeof error === 'object' && 'message' in error) {
    return toErrorMessage((error as { message: unknown }).message);
  }
  return undefined;
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
