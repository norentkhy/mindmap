import { definedElementQueries } from './queries'
import {
  clickElement,
  doubleClickElement,
  typeWithKeyboard,
  pressKey,
  pressKeyDown,
  pressKeyUp,
} from '../dependencies'
import { mapObject } from '~/utils/FunctionalProgramming'

function actionOnDefinedElementQueries(doAction) {
  return mapObject(definedElementQueries, (queryElement) => {
    return (...args) => {
      const Element = queryElement(...args)
      return doAction(Element)
    }
  })
}

const [definedClicks, definedDoubleClicks] = [
  clickElement,
  doubleClickElement,
].map((doAction) => actionOnDefinedElementQueries(doAction))

export const action = {
  typeWithKeyboard,
  pressKey,
  pressKeyDown,
  pressKeyUp,
  clickOn: { ...definedClicks },
  doubleClickOn: { ...definedDoubleClicks },
}
