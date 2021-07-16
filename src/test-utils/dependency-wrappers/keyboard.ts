import { getFocused } from '../dom'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type keyboardAction = keyof typeof keyboard
type keyboardDictKey = keyof typeof keyboardDict
type fireEventKey = keyof typeof fireEventKeyDict
type SortedKeys = { modifierKeys: string[]; normalKeys: string[] }

export default withKeyboard

function withKeyboard(type: 'type', input: string): void
function withKeyboard(type: 'press', input: string | string[]): void
function withKeyboard(type: 'keyUp' | 'keyDown', input: fireEventKey): void
function withKeyboard(type: keyboardAction, input: any) {
  const Target = getFocused()
  const { handleAction, mapInputForHandler } = keyboard[type]
  const mappedInput = mapInputForHandler(input)
  return handleAction(Target, mappedInput)
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

function sortKeys(keys: string[]): SortedKeys {
  const sortedEmpty: SortedKeys = { modifierKeys: [], normalKeys: [] }

  return keys.reduce((sorted, key) => {
    if (modifierKeys.includes(key)) sorted.modifierKeys.push(key)
    else sorted.normalKeys.push(key)
    return sorted
  }, sortedEmpty)
}

const modifierKeys = ['shift', 'ctrl', 'alt', 'meta']

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
