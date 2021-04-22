import { MainView } from '~mindmap/components'
import { viewmodel, view } from '~mindmap/test-utilities'
import React from 'react'

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
    const registerNodeLayout = viewmodel.create.mockFunction()
    const { fireResizeEvent, node } = renderTest({
      registerNodeLayout,
    })

    const Node = view.query.node(node)
    const { boundingClientRect, offsetRect } = sample
    fireResizeEvent(Node, { boundingClientRect, offsetRect })

    viewmodel.expect.mockFunction(registerNodeLayout).toBeCalledWith({
      id: node.id,
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  test('Rootnode container', () => {
    const registerTreeLayout = viewmodel.create.mockFunction()
    const { fireResizeEvent, node } = renderTest({
      registerTreeLayout,
    })

    const TreeContainer = view.query.rootTree(node)
    const { boundingClientRect, offsetRect } = sample

    fireResizeEvent(TreeContainer, { boundingClientRect, offsetRect })

    viewmodel.expect.mockFunction(registerTreeLayout).toBeCalledWith({
      id: node.id,
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  test('Node space', () => {
    const registerSurfaceLayout = viewmodel.create.mockFunction()
    const { fireResizeEvent } = renderTest({
      registerSurfaceLayout,
    })

    const Surface = view.query.mindSpace()
    const { boundingClientRect, offsetRect } = sample

    fireResizeEvent(Surface, { boundingClientRect, offsetRect })

    viewmodel.expect.mockFunction(registerSurfaceLayout).toBeCalledWith({
      boundingClientRect,
      offsetRect: convertOffsetRect(offsetRect),
    })
  })

  function renderTest(mockFunctions) {
    const node = viewmodel.create.node({ text: 'this will resize' })

    const { rendered, fireResizeEvent } = view.render({
      injectMockModelIntoJSX: ({ useMock }) => (
        <MainView useThisModel={useMock} />
      ),
      initialState: viewmodel.create.state({ rootNodes: [node] }),
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
