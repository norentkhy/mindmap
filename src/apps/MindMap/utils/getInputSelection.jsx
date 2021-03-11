export function getInputSelection(Element) {
  const { value, selectionStart, selectionEnd } = Element;
  return value.substring(selectionStart, selectionEnd);
}
