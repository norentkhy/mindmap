import { definedElementQueries } from './queries'
import {
  clickElement,
  doubleClickElement,
  typeWithKeyboard,
  pressKey,
  pressKeyDown,
  pressKeyUp,
  dragElementStart,
  dragElementEnd,
  dropElement,
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

const defined = mapObject(
  { clickElement, doubleClickElement, dragElementStart, dragElementEnd, dropElement },
  (doAction) => actionOnDefinedElementQueries(doAction)
)

export const action = {
  typeWithKeyboard,
  pressKey,
  pressKeyDown,
  pressKeyUp,
  clickOn: { ...defined.clickElement },
  doubleClickOn: { ...defined.doubleClickElement },
  dragStart: { ...defined.dragElementStart },
  dragEnd: { ...defined.dragElementEnd },
  drop: { ...defined.dropElement },
}
