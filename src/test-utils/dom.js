export function getInputSelection(Element) {
  const { value, selectionStart, selectionEnd } = Element
  return value.substring(selectionStart, selectionEnd)
}

export function getFocused() {
  return document.activeElement || document.body
}