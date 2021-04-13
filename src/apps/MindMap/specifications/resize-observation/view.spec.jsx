import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { MainView } from '~mindmap/components'
import { createDataStructure, queryNode } from '~mindmap/test-utilities/view'
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

    const Node = queryNode(node)
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

    const TreeContainer = getRootContainer(queryNode(node))
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

    const Surface = screen.getByLabelText(/^main view$/i)
    const { boundingClientRect, offsetRect } = sample

    act(() => fireResizeEvent(Surface, { boundingClientRect, offsetRect }))

    expect(registerSurfaceLayout).toBeCalledWith({
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  function getRootContainer(Node) {
    const ParentElement = Node.parentElement
    if (!ParentElement) throw new Error('no root container')
    if (ParentElement.getAttribute('aria-label') === 'container of rootnode')
      return ParentElement
    else return getRootContainer(ParentElement)
  }

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
  return render(<MainView useThisModel={useMock} />)

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
