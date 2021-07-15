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
  withKeyboard,
  generateUUID,
  addIdTo,
  expectEqualExcludingFunctions,
}


const keyboard = {
  type: {
    handleAction: userEvent.type,
    mapInputForHandler: (x: string) => x,
  },
  press: {
    handleAction: userEvent.type,
    mapInputForHandler: mapKeyCombination,
  },
  keyDown: {
    handleAction: fireEvent.keyDown,
    mapInputForHandler: mapFireKeyEvent,
  },
  keyUp: {
    handleAction: fireEvent.keyUp,
    mapInputForHandler: mapFireKeyEvent,
  },
}

function withKeyboard(type: 'type', input: string): void
function withKeyboard(type: 'press', input: string | string[]): void
function withKeyboard(type: 'keyUp' | 'keyDown', input: fireEventKey): void
function withKeyboard(type: keyboardAction, input: any) {
  const Target = getFocus()
  const { handleAction, mapInputForHandler } = keyboard[type]
  const mappedInput = mapInputForHandler(input)
  return handleAction(Target, mappedInput)
}

function mapFireKeyEvent(key: string) {
  if (!(key in fireEventKeyDict)) return key
  return fireEventKeyDict[key]
}

function mapKeyCombination(input: string[] | string) {
  if (!Array.isArray(input)) return mapToTestingLibraryKey(input)

  const { normalKeys, modifierKeys } = sortKeys(input)
  const mappedNormalKeys = normalKeys.map(mapToTestingLibraryKey)
  return combineKeys(mappedNormalKeys, modifierKeys)
}

function combineKeys(normalKeys: string[], modifierKeys: string[]) {
  const normalKeyCombination = normalKeys.join('')
  return modifierKeys.reduce(
    (inner, modifier) => `{${modifier}}${inner}{/${modifier}}`,
    normalKeyCombination
  )
}

type SortedKeys = { modifierKeys: string[]; normalKeys: string[] }
function sortKeys(keys: string[]): SortedKeys {
  const sortedEmpty: SortedKeys = { modifierKeys: [], normalKeys: [] }

  return keys.reduce((sorted, key) => {
    if (key in modifierKey) sorted.modifierKeys.push(key)
    else sorted.normalKeys.push(key)
    return sorted
  }, sortedEmpty)
}

const modifierKey = {
  shift: ['{shift}', '{/shift}'],
  ctrl: ['{ctrl}', '{/ctrl}'],
  alt: ['{alt}', '{/alt}'],
  meta: ['{meta}', '{/meta}'],
}

function mapToTestingLibraryKey(key: keyboardDictKey | string) {
  if (key in keyboardDict) return keyboardDict[key]
  return key
}

const fireEventKeyDict = {
  left: { key: 'ArrowLeft', code: 'ArrowLeft' },
  right: { key: 'ArrowRight', code: 'ArrowRight' },
  up: { key: 'ArrowUp', code: 'ArrowUp' },
  down: { key: 'ArrowDown', code: 'ArrowDown' },
}

const keyboardDict = {
  enter: '{enter}',
  left: '{arrowleft}',
  right: '{arrowright}',
  up: '{arrowup}',
  down: '{arrowdown}',
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

type keyboardAction = 'type' | 'press' | 'keyUp' | 'keyDown'
type fireEventKey = keyof typeof fireEventKeyDict
type keyboardDictKey = keyof typeof keyboardDict
type dragEventType = 'dragstart' | 'dragend' | 'drop'
