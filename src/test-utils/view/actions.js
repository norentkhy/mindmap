import { definedElementQueries } from './queries'
import { withKeyboard, withMouse } from '../dependency-wrappers'
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
    clickElement: (Element) => withMouse('click', Element),
    doubleClickElement: (Element) => withMouse('doubleClick', Element),
    dragElementStart: (Element) => withMouse('dragStart', Element),
    dragElementEnd: (Element) => withMouse('dragEnd', Element),
    dropElement: (Element) => withMouse('drop', Element),
  },
  (doAction) => actionOnDefinedElementQueries(doAction)
)

export const action = {
  withKeyboard,
  withMouse,
  clickOn: { ...defined.clickElement },
  doubleClickOn: { ...defined.doubleClickElement },
  dragStart: { ...defined.dragElementStart },
  dragEnd: { ...defined.dragElementEnd },
  drop: { ...defined.dropElement },
}
