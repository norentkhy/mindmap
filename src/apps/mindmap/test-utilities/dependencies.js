import { describe, test, expect, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { v4 as uuidv4 } from 'uuid'
import { getInputSelection } from 'test-utils/dom'

const queryElementByLabelText = screen.queryByLabelText
const queryElementByText = screen.queryByText
const clickElement = userEvent.click
const doubleClickElement = fireEvent.doubleClick
const queryAllElementsByRole = screen.queryAllByRole
const queryAllElementsByLabelText = screen.queryAllByLabelText
const debugView = screen.debug
const renderView = render
const createMockFn = jest.fn

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
  dragElementStart,
  dragElementEnd,
  dropElement,
  typeWithKeyboard,
  typeAndPressEnter,
  pressKey,
  pressKeyDown,
  pressKeyUp,
  generateUUID,
  addIdTo,
}

function typeWithKeyboard(keys) {
  const Target = getFocus()
  return userEvent.type(Target, keys)
}

function pressKeyDown(key) {
  const Target = getFocus()
  return fireEvent.keyDown(Target, fireEventKeyDict[key])
}

function pressKeyUp(key) {
  const Target = getFocus()
  return fireEvent.keyUp(Target, fireEventKeyDict[key])
}

function pressKey(key) {
  const Target = getFocus()
  const testingLibraryKey = mapToTestingLibraryKey(key)
  return userEvent.type(Target, testingLibraryKey)
}

function mapToTestingLibraryKey(key) {
  if (key in keyDict) return keyDict[key]
  return key
}

const fireEventKeyDict = {
  left: { key: 'ArrowLeft', code: 'ArrowLeft' },
  right: { key: 'ArrowRight', code: 'ArrowRight' },
  up: { key: 'ArrowUp', code: 'ArrowUp' },
  down: { key: 'ArrowDown', code: 'ArrowDown' },
}

const keyDict = {
  enter: '{enter}',
  left: '{arrowleft}',
  right: '{arrowright}',
  up: '{arrowup}',
  down: '{arrowdown}',
}

function typeAndPressEnter(text) {
  return typeWithKeyboard(`${text}{enter}`)
}

function dragElementStart(Element) {
  const dragStartEvent = createDragEvent('dragstart')
  return fireEvent(Element, dragStartEvent)
}

function dropElement(Element) {
  const dropEvent = createDragEvent('drop')
  return fireEvent(Element, dropEvent)
}

function dragElementEnd(Element) {
  const dragEndEvent = createDragEvent('dragend')
  return fireEvent(Element, dragEndEvent)
}

function createDragEvent(type) {
  const dragEvent = new MouseEvent(type, { bubbles: true, cancelable: true })
  dragEvent.dataTransfer = { effectAllowed: null }
  return dragEvent
}

function getFocus() {
  return document.activeElement || document.body
}

function generateUUID() {
  return uuidv4()
}

function addIdTo(object) {
  return { id: generateUUID(), ...object }
}
