import MindMapApp from '~mindmap/App'
import { createRootNodeWithProperties } from '~mindmap/test-utilities/integrated-view'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'

import React from 'react'
import { act, render } from '@testing-library/react'
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

    const Node = await createRootNodeWithProperties({ text: 'test' })
    expect(logResize).toBeCalledTimes(1)

    const { boundingClientRect, offsetRect } = sample
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

  test('all elements resize', async () => {
    const { fireResizeEvent, container } = renderMindMapWithMockResizeObserver()
    await createRootNodeWithProperties({ text: 'test' })
    const { boundingClientRect, offsetRect } = sample

    getAllElements(container).forEach((Element) =>
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect,
          offsetRect: mapRectToOffset(offsetRect),
        })
      )
    )
  })

  test('resize elements specifically', async () => {
    const { fireResizeEvent, container } = renderMindMapWithMockResizeObserver()
    await createRootNodeWithProperties({ text: 'test' })

    getAllElements(container).forEach((Element) => {
      if (isSurface(Element)) resizeSurface(Element)
      if (isRootContainer(Element)) resizeRootContainer(Element)
      if (isNode(Element)) resizeNode(Element)
    })

    getAllElements(container).forEach((Element) => {
      if (isRootContainer(Element)) {
        expect(Element).toHaveStyleRule('position', 'absolute')
        expect(Element).toHaveStyleRule('left', '280px')
        expect(Element).toHaveStyleRule('top', '225px')
      }
    })

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

    function isSurface(Element) {
      return Element.getAttribute('aria-label') === 'main view'
    }

    function isRootContainer(Element) {
      return Element.getAttribute('aria-label') === 'container of rootnode'
    }

    function isNode(Element) {
      return Element.getAttribute('aria-label') === 'node'
    }
  })

  function getAllElements(container) {
    return getAllChildElements(container)

    function getAllChildElements(Element) {
      const ChildElements = Array.from(Element.children)
      if (!ChildElements) return []
      return [
        Element,
        ...ChildElements.flatMap((Element) => getAllChildElements(Element)),
      ]
    }
  }

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

    const { container } = render(
      <MindMapApp
        useThisResizeObserver={useMockResizeObserver}
        logResize={logResize}
      />
    )

    return { fireResizeEvent, logResize, container }
  }
})
