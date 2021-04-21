import { MainView } from '~mindmap/components'
import { model, ui } from '~mindmap/test-utilities'
import React from 'react'
import { act } from '@testing-library/react'

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
    const { fireResizeEvent, node } = renderTest({
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
    const { fireResizeEvent, node } = renderTest({
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
    const { fireResizeEvent } = renderTest({
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

  function renderTest(mockFunctions) {
    const node = model.create.node({ text: 'this will resize' })

    const { rendered, fireResizeEvent } = ui.renderView({
      injectMockModelIntoJSX: ({ useMock }) => (
        <MainView useThisModel={useMock} />
      ),
      initialState: model.create.state({ rootNodes: [node] }),
      mockHookModifications: mockFunctions,
    })

    return { rendered, fireResizeEvent, node }
  }
})

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
