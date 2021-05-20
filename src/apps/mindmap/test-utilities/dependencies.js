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
const debugView = screen.debug
const renderView = render
const createMockFn = jest.fn

export {
  describe,
  test,
  createMockFn,
  queryElementByLabelText,
  queryElementByText,
  clickElement,
  doubleClickElement,
  expect,
  waitFor,
  render,
  renderView,
  debugView,
  typeWithKeyboard,
  typeAndPressEnter,
  pressKey,
  getFocus,
  getInputSelection,
  generateUUID,
  addIdTo,
  queryAllElementsByRole,
}

function typeWithKeyboard(keys) {
  const Target = getFocus()
  return userEvent.type(Target, keys)
}

function pressKey(key) {
  const Target = getFocus()
  const testingLibraryKey = mapToTestingLibraryKey(key)
  return userEvent.type(Target, testingLibraryKey)
}

function mapToTestingLibraryKey(key) {
  switch (key) {
    case 'enter':
      return '{enter}'
    default:
      return key
  }
}

function typeAndPressEnter(text) {
  return typeWithKeyboard(`${text}{enter}`)
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
