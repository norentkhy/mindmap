import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'

import React from 'react'
import { act } from '@testing-library/react'
import 'jest-styled-components'

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

    ui.mouseAction.createRootNode()
    await ui.waitFor.nodeInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter('test')
    await ui.waitFor.nodeInput().not.toBeVisible()

    expect(logResize).toBeCalledTimes(1)

    const { boundingClientRect, offsetRect } = sample
    const Node = ui.query.node({ text: 'test' })
    act(() =>
      fireResizeEvent(Node, {
        boundingClientRect,
        offsetRect: mapRectToOffset(offsetRect),
      })
    )

    expect(logResize).toBeCalledWith(
      expect.objectContaining({
        boundingClientRect,
        offsetRect,
      })
    )
  })

  test('resize all elements: no error', async () => {
    const { fireResizeEvent } = renderMindMapWithMockResizeObserver()

    ui.mouseAction.createRootNode()
    await ui.waitFor.nodeInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter('test')
    await ui.waitFor.nodeInput().not.toBeVisible()

    const AllElements = ui.query.allElements()
    const { boundingClientRect, offsetRect } = sample
    AllElements.forEach((Element) =>
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect,
          offsetRect: mapRectToOffset(offsetRect),
        })
      )
    )
  })

  test('resize elements specifically', async () => {
    const { fireResizeEvent } = renderMindMapWithMockResizeObserver()

    ui.mouseAction.createRootNode()
    await ui.waitFor.nodeInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter('test')
    await ui.waitFor.nodeInput().not.toBeVisible()

    simulateRelevantResizes()

    ui.expect.rootTree({ text: 'test' }).toHaveStyle({
      position: 'absolute',
      left: '280px',
      top: '225px',
    })

    function simulateRelevantResizes() {
      const { MindSpace, RootTrees, Nodes } = ui.query.relevantResizeElements()

      resizeSurface(MindSpace)
      RootTrees.forEach(resizeRootContainer)
      Nodes.forEach(resizeNode)
    }

    function resizeSurface(Element) {
      const Rect = { left: 0, top: 0, width: 640, height: 480 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
    }

    function resizeRootContainer(Element) {
      const Rect = { left: 0, top: 0, width: 100, height: 30 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
    }

    function resizeNode(Element) {
      const Rect = { left: 0, top: 5, width: 80, height: 20 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
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
    const {
      useMockResizeObserver,
      fireResizeEvent,
    } = createMockResizeObserverHook()
    const logResize = jest.fn()

    const { container } = ui.render(
      <MindMapApp
        useThisResizeObserver={useMockResizeObserver}
        logResize={logResize}
      />
    )

    return { fireResizeEvent, logResize, container }
  }
})
