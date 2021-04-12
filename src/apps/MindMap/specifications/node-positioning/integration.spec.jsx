import MindMapApp from '~mindmap/App'
import { createRootNodeWithProperties } from '~mindmap/MindMapTestUtilities'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'

import React from 'react'
import { act, render } from '@testing-library/react'
import 'jest-styled-components'

describe('mocks due to test environment', () => {
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

    function mapRectToOffset({ left, top, width, height }) {
      return {
        offsetLeft: left,
        offsetTop: top,
        offsetWidth: width,
        offsetHeight: height,
      }
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
