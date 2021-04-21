import MindMapApp from '~mindmap/App'
import { ui, model } from '~mindmap/test-utilities'
import React from 'react'

describe('mocks due to test environment', () => {
  test('resize elements specifically', async () => {
    const { fireResizeEvent } = renderMindMapWithMockResizeObserver()
    ui.mouseAction.createRootNode()
    ui.keyboardAction.typeAndPressEnter('test')

    simulateResizeOfRelevantElements()

    ui.expect.rootTree({ text: 'test' }).toHaveStyle({
      position: 'absolute',
      left: '280px',
      top: '225px',
    })

    function simulateResizeOfRelevantElements() {
      const { MindSpace, RootTrees, Nodes } = ui.query.relevantResizeElements()
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

    function mapRectToOffset({ left, top, width, height }) {
      return {
        offsetLeft: left,
        offsetTop: top,
        offsetWidth: width,
        offsetHeight: height,
      }
    }
  })

  function renderMindMapWithMockResizeObserver() {
    const logResize = model.create.mockFunction()

    const { fireResizeEvent } = ui.renderView({
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
