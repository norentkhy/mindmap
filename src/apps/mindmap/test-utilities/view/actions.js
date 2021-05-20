import { definedElementQueries } from './queries'
import {
  clickElement,
  doubleClickElement,
  typeWithKeyboard,
  pressKey,
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
  clickOn: { ...definedClicks },
  doubleClickOn: { ...definedDoubleClicks },
}
