import { renderHook, act } from '@testing-library/react-hooks'
import { useLayoutEffect } from 'react'
import { getArgsOfLastCall } from '../utils/jestUtils'

describe('mock useResizeObserver', () => {
  test('fireResizeEvent is trigged when made', () => {
    const { callback } = renderMockResizeSituation()

    expect(callback).toBeCalled()
    const [
      {
        target: { getBoundingClientRect },
      },
    ] = getArgsOfLastCall(callback)
    expect(getBoundingClientRect()).toEqual({
      left: 10,
      top: 10,
      right: 20,
      bottom: 20,
      width: 10,
      height: 10,
      x: 10,
      y: 10,
    })
  })

  test('fireResizeEvent triggers callback', () => {
    const { fireResizeEvent, callback, testRef } = renderMockResizeSituation()

    const arg = 'something'
    act(() => fireResizeEvent(testRef.current, arg))

    expect(callback).toBeCalledTimes(2)
    const [
      {
        target: { getBoundingClientRect },
      },
    ] = getArgsOfLastCall(callback)
    expect(getBoundingClientRect()).toEqual(arg)
  })

  function renderMockResizeSituation() {
    const {
      fireResizeEvent,
      useMockResizeObserver,
    } = createMockResizeObserverHook()

    const testRef = { current: 'something' }
    const callback = jest.fn()
    renderHook(() => useMockResizeObserver(testRef, callback))

    return { fireResizeEvent, callback, testRef }
  }
})

export default function createMockResizeObserverHook() {
  const callbacks = new Map()

  return { fireResizeEvent, useMockResizeObserver }

  function useMockResizeObserver(ref, callback) {
    useLayoutEffect(() => {
      const Element = ref.current

      if (Element) {
        callbacks.set(Element, callback)
        callback({ target: { getBoundingClientRect: () => someDimensions } })

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
