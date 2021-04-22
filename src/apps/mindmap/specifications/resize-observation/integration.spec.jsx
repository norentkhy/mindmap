import MindMapApp from '~mindmap/App'
import { view, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('mocks due to test environment', () => {
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
    offsetRect: { left: 5, top: 3, width: 10, height: 4 },
  }

  test('node resize event gets logged', async () => {
    const { fireResizeEvent, logResize } = renderMindMapWithMockResizeObserver()

    view.action.mouse.createRootNode()
    await view.waitFor.nodeInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter('test')
    await view.waitFor.nodeInput().not.toBeVisible()

    viewmodel.expect.mockFunction(logResize).toBeCalledTimes(1)

    const { boundingClientRect, offsetRect } = sample
    const Node = view.query.node({ text: 'test' })
    fireResizeEvent(Node, {
      boundingClientRect,
      offsetRect: mapRectToOffset(offsetRect),
    })

    viewmodel.expect.mockFunction(logResize).toBeCalledWith(
      expect.objectContaining({
        boundingClientRect,
        offsetRect,
      })
    )
  })

  test('resize all elements: no error', async () => {
    const { fireResizeEvent } = renderMindMapWithMockResizeObserver()

    view.action.mouse.createRootNode()
    await view.waitFor.nodeInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter('test')
    await view.waitFor.nodeInput().not.toBeVisible()

    const AllElements = view.query.allElements()
    const { boundingClientRect, offsetRect } = sample
    AllElements.forEach((Element) =>
      fireResizeEvent(Element, {
        boundingClientRect,
        offsetRect: mapRectToOffset(offsetRect),
      })
    )
  })

  test('resize elements specifically', async () => {
    const { fireResizeEvent } = renderMindMapWithMockResizeObserver()

    view.action.mouse.createRootNode()
    await view.waitFor.nodeInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter('test')
    await view.waitFor.nodeInput().not.toBeVisible()

    simulateRelevantResizes()

    view.expect.rootTree({ text: 'test' }).toHaveStyle({
      position: 'absolute',
      left: '280px',
      top: '225px',
    })

    function simulateRelevantResizes() {
      const {
        MindSpace,
        RootTrees,
        Nodes,
      } = view.query.relevantResizeElements()

      resizeSurface(MindSpace)
      RootTrees.forEach(resizeRootContainer)
      Nodes.forEach(resizeNode)
    }

    function resizeSurface(Element) {
      const Rect = { left: 0, top: 0, width: 640, height: 480 }
      fireResizeEvent(Element, {
        boundingClientRect: Rect,
        offsetRect: mapRectToOffset(Rect),
      })
    }

    function resizeRootContainer(Element) {
      const Rect = { left: 0, top: 0, width: 100, height: 30 }
      fireResizeEvent(Element, {
        boundingClientRect: Rect,
        offsetRect: mapRectToOffset(Rect),
      })
    }

    function resizeNode(Element) {
      const Rect = { left: 0, top: 5, width: 80, height: 20 }
      fireResizeEvent(Element, {
        boundingClientRect: Rect,
        offsetRect: mapRectToOffset(Rect),
      })
    }
  })

  function mapRectToOffset({ left, top, width, height }) {
    return {
      offsetLeft: left,
      offsetTop: top,
      offsetWidth: width,
      offsetHeight: height,
    }
  }

  function renderMindMapWithMockResizeObserver() {
    const logResize = viewmodel.create.mockFunction()

    const { fireResizeEvent } = view.render({
      injectMockModelIntoJSX: ({ useMockResizeObserver }) => (
        <MindMapApp
          useThisResizeObserver={useMockResizeObserver}
          logResize={logResize}
        />
      ),
    })

    return { fireResizeEvent, logResize }
  }
})
