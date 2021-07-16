import { describe, test, expect, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

const queryElementByLabelText = screen.queryByLabelText
const queryElementByText = screen.queryByText
const queryAllElementsByRole = screen.queryAllByRole
const queryAllElementsByLabelText = screen.queryAllByLabelText
const debugView = screen.debug
const renderView = render
const createMockFn = jest.fn

export { default as withKeyboard } from './keyboard'
export { default as withMouse } from './mouse'
export { addIdTo } from './id'
export { getInputSelection, getFocused } from '../dom'

export {
  describe,
  test,
  createMockFn,
  queryElementByLabelText,
  queryElementByText,
  queryAllElementsByRole,
  queryAllElementsByLabelText,
  expect,
  waitFor,
  render,
  renderView,
  debugView,
  expectEqualExcludingFunctions,
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
