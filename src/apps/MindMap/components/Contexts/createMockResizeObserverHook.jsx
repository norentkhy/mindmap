import { useCallback, useLayoutEffect } from 'react'

export default function createMockResizeObserverHook(
  initialTargetProperties = {
    getBoundingClientRect: () => sample.boundingClientRect,
  }
) {
  const callbacks = new Map()

  return { fireResizeEvent, useMockResizeObserver }

  function useMockResizeObserver(ref, callback) {
    const callThisBack = useCallback(callback, [])

    useLayoutEffect(() => {
      const Element = ref.current

      if (Element) {
        mockInitialResize({
          Element,
          callback: () => callThisBack({ target: initialTargetProperties }),
        })
        callbacks.set(Element, callThisBack)

        return () => {
          callbacks.delete(Element)
        }
      }
    }, [ref.current, callThisBack])
  }

  function fireResizeEvent(
    Element,
    {
      boundingClientRect = sample.boundingClientRect,
      offsetRect = sample.offsetRect,
    }
  ) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = offsetRect
    const callback = callbacks.get(Element)
    callback?.({
      target: {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight,
        getBoundingClientRect: () => boundingClientRect,
      },
    })
  }
}

function mockInitialResize({ Element, callback }) {
  if (!Element.firstResizeCallback) {
    Element.firstResizeCallback = callback
    callback()
  }
}

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
