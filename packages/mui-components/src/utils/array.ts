import type { OptionPrimitive } from '@/common';
import { generateLabelValueErrMsg } from '@/utils';

function isPrimitiveArray(
  options: readonly unknown[]
): options is OptionPrimitive[] {
  return options.every(
    opt => typeof opt === 'string' || typeof opt === 'number'
  );
}

/**
 * Validates the `options` of an option-based field, throwing a descriptive
 * `Error` when they can't be rendered. Every option-based component in this
 * package calls it before rendering; it is also exported from
 * `@nish1896/mui-components/form-helpers`, so a wrapper component can run the
 * same check first and have the error name the wrapper instead.
 *
 * Throws when `options` is not an array, or when it holds anything other than
 * strings and numbers (i.e. objects) and `labelKey` or `valueKey` is missing.
 * An empty array is valid, and the keys themselves are not checked against
 * the objects.
 *
 * @param formElementName - Component name used in the error message, e.g. `'MUISelect'`.
 * @param options - The options to validate.
 * @param labelKey - Object key holding each option's label, required for object options.
 * @param valueKey - Object key holding each option's value, required for object options.
 * @param optionsPropName - Name of the options prop used in the message. Default `'options'`.
 * @throws {Error} If `options` is not an array, or object options lack `labelKey`/`valueKey`.
 */
export function validateArray<
  Option,
  LabelKey extends string | undefined,
  ValueKey extends string | undefined
>(
  formElementName: string,
  options: Option[],
  labelKey?: LabelKey,
  valueKey?: ValueKey,
  optionsPropName = 'options'
): void {
  if (!Array.isArray(options)) {
    throw new Error(
      `The "${optionsPropName}" prop of ${formElementName} must be an array.`
    );
  }
  const isPrimitive = isPrimitiveArray(options);
  if (!isPrimitive && (!labelKey || !valueKey)) {
    throw new Error(generateLabelValueErrMsg(formElementName));
  }
}
