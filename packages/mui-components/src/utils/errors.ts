export function getErrorList(errorMessage?: string | string[]) {
  return (typeof errorMessage === 'string' ? [errorMessage] : (errorMessage ?? [])).filter(
    message => message.trim() !== ''
  );
}

export function generateLabelValueErrMsg(formElement: string) {
  return `Provide "labelKey" & "valueKey" props in ${formElement} if options are an array of objects.`;
}

export function generateDateAdapterErrMsg(formElement: string) {
  return `Missing "dateAdapter" for ${formElement}. Please wrap your component tree with "ConfigProvider dateAdapter={...}>" to configure it.`;
}

export function generateUnitInputFieldNameErrMsg() {
  return 'Provide both "unit" and "value" keys in the "fieldName" prop of "MUIUnitInput", e.g. fieldName={{ unit: "priceUnit", value: "priceAmount" }}.';
}

export function generateInvalidBoundsErrMsg(min: number, max: number) {
  return `Invalid bounds: "min" (${min}) is greater than "max" (${max}). Swap the values or remove one of the props.`;
}
