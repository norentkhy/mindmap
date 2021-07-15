import { definedElementQueries } from './queries'
import {
  clickElement,
  doubleClickElement,
  withKeyboard,
  typeWithKeyboard,
  pressKey,
  pressKeyDown,
  pressKeyUp,
  dragElement,
} from '../dependency-wrappers'
import { mapObject } from 'src/utils/FunctionalProgramming'

function actionOnDefinedElementQueries(doAction) {
  return mapObject(definedElementQueries, (queryElement) => {
    return (...args) => {
      const Element = queryElement(...args)
      return doAction(Element)
    }
  })
}

const defined = mapObject(
  {
    clickElement,
    doubleClickElement,
    dragElementStart: (Element) => dragElement('dragstart', Element),
    dragElementEnd: (Element) => dragElement('dragend', Element),
    dropElement: (Element) => dragElement('drop', Element),
  },
  (doAction) => actionOnDefinedElementQueries(doAction)
)

export const action = {
  withKeyboard,
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
