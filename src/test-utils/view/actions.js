import userEvent from '@testing-library/user-event'

export const action = {
  keyboard: {
    typeAndPressEnter,
  },
  mouse: {},
}

function typeWithKeyboard(keys) {
  const Target = getFocus()
  return userEvent.type(Target, keys)
}

function typeAndPressEnter(text) {
  return typeWithKeyboard(`${text}{enter}`)
}

export function getFocus() {
  return document.activeElement || document.body
}
