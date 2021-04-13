import React, { useContext } from 'react'
import { describe, test, expect } from '@jest/globals'
import { act, renderHook } from '@testing-library/react-hooks'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'
import { ModelContext, ModelProvider } from '~mindmap/components/Model'

describe('dimensions', () => {
  test('update of node layout dimensions', () => {
    const { result } = renderHookTestAndCreateRootNode()
    const { id } = getNewestRootNode(result)

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerNodeLayout({
        id,
        boundingClientRect,
        offsetRect,
      })
    )

    const node = getNewestRootNode(result)
    expect(node.measuredNode).toEqual({ boundingClientRect, offsetRect })
  })

  test('update of tree layout dimensions', () => {
    const { result } = renderHookTestAndCreateRootNode()
    const { id } = getNewestRootNode(result)

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerTreeLayout({
        id,
        boundingClientRect,
        offsetRect,
      })
    )

    const node = getNewestRootNode(result)
    expect(node.measuredTree).toEqual({ boundingClientRect, offsetRect })
  })

  test('update mind surface layout dimensions', () => {
    const { result } = renderHookTest()

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerSurfaceLayout({
        boundingClientRect,
        offsetRect,
      })
    )

    const { measuredSurface } = getState(result)
    expect(measuredSurface).toEqual({
      boundingClientRect,
      offsetRect,
    })
  })

  function renderHookTestAndCreateRootNode() {
    const rendered = renderHookTest()
    act(() => rendered.result.current.createRootNode())
    return rendered
  }
})

describe('logging of changes', () => {
  test('dimensions update', () => {
    const { result, log } = renderHookTestWithNodeForLogging()

    const { id } = getNewestRootNode(result)
    const boundingClientRect = 'bounding client rectangle'
    const offsetRect = {
      offsetLeft: 'offset left',
      offsetTop: 'offset top',
      offsetWidth: 'offset width',
      offsetHeight: 'offset height',
    }
    act(() =>
      result.current.registerNodeLayout({
        id,
        boundingClientRect: boundingClientRect,
        offsetRect,
      })
    )

    expect(log).toBeCalled()
    expect(log).toBeCalledWith({ id, boundingClientRect, offsetRect })

    function renderHookTestWithNodeForLogging() {
      const log = jest.fn()
      const { result } = renderHookTest(log)
      act(() => result.current.createRootNode())

      return { result, log }
    }
  })
})

function getRootNodes(result) {
  const state = getState(result)
  return state.trees
}

function getNewestRootNode(result) {
  const rootNodes = getRootNodes(result)
  return rootNodes[rootNodes.length - 1]
}

function getState(result) {
  return result.current.state
}

function renderHookTest(log) {
  const { useMockResizeObserver } = createMockResizeObserverHook()

  return renderHook(() => useContext(ModelContext), {
    wrapper: ({ children }) => (
      <ModelProvider
        useThisResizeObserver={useMockResizeObserver}
        logResize={log}
      >
        {' '}
        {children}
      </ModelProvider>
    ),
  })
}
