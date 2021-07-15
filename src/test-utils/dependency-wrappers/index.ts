import { getInputSelection } from '../dom'
import { v4 as uuidv4 } from 'uuid'
import { describe, test, expect, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const queryElementByLabelText = screen.queryByLabelText
const queryElementByText = screen.queryByText
const clickElement = userEvent.click
const doubleClickElement = fireEvent.doubleClick
const queryAllElementsByRole = screen.queryAllByRole
const queryAllElementsByLabelText = screen.queryAllByLabelText
const debugView = screen.debug
const renderView = render
const createMockFn = jest.fn

export {default as withKeyboard} from './keyboard'

export {
  describe,
  test,
  createMockFn,
  queryElementByLabelText,
  queryElementByText,
  queryAllElementsByRole,
  queryAllElementsByLabelText,
  getFocus,
  getInputSelection,
  expect,
  waitFor,
  render,
  renderView,
  debugView,
  clickElement,
  doubleClickElement,
  dragElement,
  generateUUID,
  addIdTo,
  expectEqualExcludingFunctions,
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

function getFocus() {
  return document.activeElement || document.body
}

function generateUUID() {
  return uuidv4()
}

function addIdTo(object: object) {
  return { id: generateUUID(), ...object }
}

function expectEqualExcludingFunctions(a: object, b: object) {
  const [excludedA, excludedB] = [a, b].map(excludeDeepFunctions)
  return expect(excludedA).toEqual(excludedB)
}

function excludeDeepFunctions(obj: object) {
  const newObj = { ...obj }
  const entries = Object.entries(newObj)
  entries.forEach(([key, value]) => {
    if (typeof value === 'function') delete newObj[key]
    if (typeof value === 'object' && value !== null)
      newObj[key] = excludeDeepFunctions(value)
  })
  return newObj
}

type dragEventType = 'dragstart' | 'dragend' | 'drop'
