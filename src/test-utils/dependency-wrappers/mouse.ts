import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export default withMouse

type mouseAction = keyof typeof mouse
type dragEventType = 'dragstart' | 'dragend' | 'drop'

const mouse = {
  click: userEvent.click,
  doubleClick: userEvent.dblClick,
  dragStart: (Element: HTMLElement) => dragElement('dragstart', Element),
  dragEnd: (Element: HTMLElement) => dragElement('dragend', Element),
  drop: (Element: HTMLElement) => dragElement('drop', Element),
}

function withMouse(type: mouseAction, TargetElement: HTMLElement) {
  const handleMouseAction = mouse[type]
  return handleMouseAction(TargetElement)
}

function dragElement(type: dragEventType, Element: HTMLElement) {
  const dragEvent = createDragEvent(type)
  return fireEvent(Element, dragEvent)
}

function createDragEvent(type: dragEventType) {
  const dragEvent = new MouseEvent(type, { bubbles: true, cancelable: true })
  // @ts-expect-error: workaround due to non-existence of DragEvent in js-dom
  dragEvent.dataTransfer = { effectAllowed: null }
  return dragEvent
}
