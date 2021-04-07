import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import * as TLR from '@testing-library/react'
import { useRef, useState } from 'react'
import { getArgsOfLastCall } from '../../utils/jestUtils'
import createMockResizeObserverHook from './createMockResizeObserverHook'

describe('mock useResizeObserver', () => {
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

  test('fireResizeEvent is trigged when made', () => {
    const { callback } = renderMockResizeSituation()

    expect(callback).toBeCalled()
    const { getBoundingClientRect } = getArgsOfLastCall(callback)[0].target
    expect(getBoundingClientRect()).toEqual(sample.boundingClientRect)
  })

  test('specified initial target properties', () => {
    const initialTargetProperties = {
      offsetLeft: 20,
      offsetTop: 30,
      offsetWidth: 40,
      offsetHeight: 50,
    }

    const { callback } = renderMockResizeSituation(initialTargetProperties)
    const [{ target }] = getArgsOfLastCall(callback)
    expect(target).toEqual(initialTargetProperties)
  })

  test('fireResizeEvent triggers callback', () => {
    const { fireResizeEvent, callback, testRef } = renderMockResizeSituation()

    act(() =>
      fireResizeEvent(testRef.current, {
        boundingClientRect: sample.boundingClientRect,
        offsetRect: sample.offsetRect,
      })
    )

    expect(callback).toBeCalledTimes(2)
    expect(callback).nthCalledWith(2, {
      target: expect.objectContaining(sample.offsetRect),
    })
  })

  function renderMockResizeSituation(initialTargetProperties) {
    const {
      fireResizeEvent,
      useMockResizeObserver,
    } = createMockResizeObserverHook(initialTargetProperties)

    const testRef = {
      current: { note: 'this is supposed to be an HTML object or a fiber' },
    }
    const callback = jest.fn()
    renderHook(() => useMockResizeObserver(testRef, callback))

    return { fireResizeEvent, callback, testRef }
  }
})

describe('found bugs', () => {
  test('render loop', () => {
    const { useMockResizeObserver } = createMockResizeObserverHook()
    const resizeCallback = jest.fn(() => {})
    TLR.render(
      <Trigger
        useMockResizeObserver={useMockResizeObserver}
        onResize={resizeCallback}
      />
    )

    expect(resizeCallback).toBeCalledTimes(1)

    const TriggerButton = TLR.screen.getByText('Trigger')
    TLR.fireEvent.click(TriggerButton)

    expect(resizeCallback).toBeCalledTimes(1)

    function Trigger({ useMockResizeObserver, onResize }) {
      const ref = useRef()
      const [count, setCount] = useState(0)
      useMockResizeObserver(ref, onResize)

      return (
        <button ref={ref} onClick={() => setCount(count + 1)}>
          Trigger
        </button>
      )
    }
  })
})
