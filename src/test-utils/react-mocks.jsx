import React, { createContext, useCallback, useLayoutEffect } from 'react'

export function createMockContextProvider(
  { initialState = {}, modifications = {}, useModel } = {
    initialState: {},
    modifications: {},
  }
) {
  const Context = createContext()

  return [Context, Provider]

  function Provider({ children }) {
    const model = useModel
      ? useModel()
      : { state: initialState, ...modifications }
    return <Context.Provider value={model}>{children}</Context.Provider>
  }
}

export function createMockResizeObserverHook(
  initialTargetProperties = {
    getBoundingClientRect: () => sizeExample.boundingClientRect,
    offsetLeft: 0,
    offsetTop: 0,
    offsetWidth: 10,
    offsetHeight: 10,
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
      boundingClientRect = sizeExample.boundingClientRect,
      offsetRect = sizeExample.offsetRect,
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

  function mockInitialResize({ Element, callback }) {
    if (!Element.firstResizeCallback) {
      Element.firstResizeCallback = callback
      callback()
    }
  }
}

const sizeExample = {
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
