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
