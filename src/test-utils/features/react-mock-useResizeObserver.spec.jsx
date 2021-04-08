import { renderHook, act } from '@testing-library/react-hooks'
import { getArgsOfLastCall } from 'test-utils/jest'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'

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

  test('fireResizeEvent is triggered when made', () => {
    const { callback } = renderMockResizeSituation()

    expect(callback).toBeCalled()
    const { getBoundingClientRect } = getLastEvent(callback).target
    expect(getBoundingClientRect()).toEqual(sample.boundingClientRect)
  })

  test('not triggered when hook is re-rendered', () => {
    const { callback, rerender } = renderMockResizeSituation()

    expect(callback).toBeCalledTimes(1)
    rerender()
    expect(callback).toBeCalledTimes(1)
  })

  test('specified initial target properties', () => {
    const initialTargetProperties = {
      offsetLeft: 20,
      offsetTop: 30,
      offsetWidth: 40,
      offsetHeight: 50,
    }
    const { callback } = renderMockResizeSituation(initialTargetProperties)

    const { target } = getLastEvent(callback)
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
    const { rerender } = renderHook(() =>
      useMockResizeObserver(testRef, callback)
    )

    return { fireResizeEvent, callback, testRef, rerender }
  }

  function getLastEvent(callback) {
    return getArgsOfLastCall(callback)[0]
  }
})
