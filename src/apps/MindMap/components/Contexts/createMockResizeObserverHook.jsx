import { useLayoutEffect } from 'react'

export default function createMockResizeObserverHook(
  initialTargetProperties = { getBoundingClientRect: () => someDimensions }
) {
  const callbacks = new Map()

  return { fireResizeEvent, useMockResizeObserver }

  function useMockResizeObserver(ref, callback) {
    useLayoutEffect(() => {
      const Element = ref.current

      if (Element) {
        callbacks.set(Element, callback)
        callback({ target: initialTargetProperties })

        return () => {
          callbacks.delete(Element)
        }
      }
    }, [ref.current, callback])
  }

  function fireResizeEvent(Element, dimensions) {
    const callback = callbacks.get(Element)
    callback?.({ target: { getBoundingClientRect: () => dimensions } })
  }
}
const someDimensions = {
  left: 10,
  top: 10,
  right: 20,
  bottom: 20,
  width: 10,
  height: 10,
  x: 10,
  y: 10,
}
