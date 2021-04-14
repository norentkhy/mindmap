import { MainView } from '~mindmap/components'
import { createDataStructure, ui } from '~mindmap/test-utilities/view'
import React from 'react'
import { act } from '@testing-library/react'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'
import 'jest-styled-components'

describe('Observation of dimensions', () => {
  const sample = {
    boundingClientRect: {
      left: 101,
      top: 102,
      right: 203,
      bottom: 204,
      width: 105,
      height: 106,
      x: 101,
      y: 102,
    },
    offsetRect: {
      offsetLeft: 5,
      offsetTop: 3,
      offsetWidth: 10,
      offsetHeight: 4,
    },
  }

  test('Rootnode', () => {
    const registerNodeLayout = jest.fn()
    const { fireResizeEvent, node } = renderTestWithMockResizeObserver({
      registerNodeLayout,
    })

    const Node = ui.query.node(node)
    const { boundingClientRect, offsetRect } = sample
    act(() => fireResizeEvent(Node, { boundingClientRect, offsetRect }))

    expect(registerNodeLayout).toBeCalledWith({
      id: node.id,
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  test('Rootnode container', () => {
    const registerTreeLayout = jest.fn()
    const { fireResizeEvent, node } = renderTestWithMockResizeObserver({
      registerTreeLayout,
    })

    const TreeContainer = ui.query.rootTree(node)
    const { boundingClientRect, offsetRect } = sample

    act(() =>
      fireResizeEvent(TreeContainer, { boundingClientRect, offsetRect })
    )

    expect(registerTreeLayout).toBeCalledWith({
      id: node.id,
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  test('Node space', () => {
    const registerSurfaceLayout = jest.fn()
    const { fireResizeEvent } = renderTestWithMockResizeObserver({
      registerSurfaceLayout,
    })

    const Surface = ui.query.mindSpace()
    const { boundingClientRect, offsetRect } = sample

    act(() => fireResizeEvent(Surface, { boundingClientRect, offsetRect }))

    expect(registerSurfaceLayout).toBeCalledWith({
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  function renderTestWithMockResizeObserver(mockFunctions) {
    const {
      useMockResizeObserver,
      fireResizeEvent,
    } = createMockResizeObserverHook()

    const { initialState, node } = createInitialStateWithNodeForResizing()

    const rendered = renderTest({
      initialState,
      modifications: {
        useThisResizeObserver: useMockResizeObserver,
        ...mockFunctions,
      },
    })

    return { rendered, fireResizeEvent, node }

    function createInitialStateWithNodeForResizing() {
      const node = createDataStructure.node({ text: 'this will resize' })

      const initialState = createDataStructure.state({
        rootNodes: [node],
      })

      return { initialState, node }
    }
  }
})

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  return ui.render(<MainView useThisModel={useMock} />)

  function useMock() {
    return {
      state: initialState,
      useThisResizeObserver() {},
      registerNodeLayout() {},
      registerTreeLayout() {},
      registerSurfaceLayout() {},
      adjustRootTree() {},
      ...modifications,
    }
  }
}

function convertOffsetRect({
  offsetLeft,
  offsetTop,
  offsetWidth,
  offsetHeight,
}) {
  return {
    left: offsetLeft,
    top: offsetTop,
    width: offsetWidth,
    height: offsetHeight,
  }
}
