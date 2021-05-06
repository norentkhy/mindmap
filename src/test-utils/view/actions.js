import userEvent from '@testing-library/user-event'
import { mapObject } from '~/utils/FunctionalProgramming'
import { definedElementQueries, getFocus } from './queries'

const definedElementClicks = mapObject(definedElementQueries, clickElement)

export const action = {
  typeAndPressEnter,
  click: definedElementClicks,
}

function clickElement(queryElement) {
  return (elementInfo) => {
    const Element = queryElement(elementInfo)
    return userEvent.click(Element)
  }
}

function typeWithKeyboard(keys) {
  const Target = getFocus()
  return userEvent.type(Target, keys)
}

function typeAndPressEnter(text) {
  return typeWithKeyboard(`${text}{enter}`)
}
