import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { v4 as uuidv4 } from 'uuid'
import { getInputSelection } from 'test-utils/dom'

const queryElementByLabelText = screen.queryByLabelText
const queryElementByText = screen.queryByText
const clickElement = userEvent.click
const doubleClickElement = fireEvent.doubleClick

export {
  queryElementByLabelText,
  queryElementByText,
  clickElement,
  doubleClickElement,
  expect,
  waitFor,
  render,
  typeWithKeyboard,
  typeAndPressEnter,
  getFocus,
  getInputSelection,
  generateUUID,
}

function typeWithKeyboard(keys) {
  const Target = getFocus()
  return userEvent.type(Target, keys)
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
