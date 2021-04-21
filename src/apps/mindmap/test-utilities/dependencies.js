import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { v4 as uuidv4 } from 'uuid'
import { getInputSelection } from 'test-utils/dom'
import {
  createMockContextProvider,
  createMockResizeObserverHook,
} from 'test-utils/react-mocks'
import React from 'react'

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
  renderView,
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

function renderView({
  JSX,
  injectMockModelIntoJSX,
  mockHookModifications,
  initialState,
  renderOptions,
}) {
  if (shouldRenderVanilla({ JSX, injectMockModelIntoJSX }))
    return renderVanilla({ JSX, renderOptions })

  return renderWithMockSuite({
    injectMockModelIntoJSX,
    renderOptions,
    initialState,
  })

  function shouldRenderVanilla({ JSX, injectMockModelIntoJSX }) {
    if (!JSX && !injectMockModelIntoJSX) throwError('NOTHING_TO_RENDER')
    if (JSX && injectMockModelIntoJSX) throwError('TOO_MANY_DEFINED')
    return Boolean(JSX && !injectMockModelIntoJSX)

    function throwError(type) {
      const tipMessage =
        'Tip:\n' +
        '- Define only one of the two to get rid of this error.\n' +
        "- 'JSX' is the most vanilla render method.\n" +
        "- 'injectMockModelIntoJSX' allows automatic injection of a suite of mock features.\n"

      switch (type) {
        case 'NOTHING_TO_RENDER':
          throw new Error(
            'Nothing to render:\n' +
              "- Neither 'JSX' nor 'injectMockModelIntoJSX' are defined.\n" +
              '\n' +
              tipMessage
          )
        case 'TOO_MANY_DEFINED':
          throw new Error(
            'Unable to determine render method:\n' +
              "- 'JSX' and 'injectMockModelIntoJSX' are both defined.\n" +
              '\n' +
              tipMessage
          )
      }
    }
  }

  function renderVanilla({ JSX, renderOptions }) {
    return {
      rendered: render(JSX, renderOptions),
    }
  }

  function renderWithMockSuite({
    injectMockModelIntoJSX,
    renderOptions,
    initialState,
  }) {
    const {
      useMockResizeObserver,
      fireResizeEvent,
    } = createMockResizeObserverHook()

    const [MockContext, MockProvider] = createMockContextProvider({
      useModel: useMock,
    })

    const injections = { useMock, MockContext, useMockResizeObserver }

    return {
      rendered: render(
        <MockProvider>{injectMockModelIntoJSX(injections)}</MockProvider>,
        renderOptions
      ),
      fireResizeEvent,
    }

    function useMock() {
      return {
        state: initialState,
        useThisResizeObserver: useMockResizeObserver,
        registerNodeLayout() {},
        registerTreeLayout() {},
        registerSurfaceLayout() {},
        adjustRootTree() {},
        ...mockHookModifications,
      }
    }
  }
}
