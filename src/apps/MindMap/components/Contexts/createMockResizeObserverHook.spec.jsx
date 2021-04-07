import { renderHook, act } from '@testing-library/react-hooks'
import { getArgsOfLastCall } from '../../utils/jestUtils'
import createMockResizeObserverHook from './createMockResizeObserverHook'

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

    const arg = 'some arg'
    act(() => fireResizeEvent(testRef.current, arg))

    expect(callback).toBeCalledTimes(2)
    const [
      {
        target: { getBoundingClientRect },
      },
    ] = getArgsOfLastCall(callback)
    expect(getBoundingClientRect()).toEqual(arg)
  })

  function renderMockResizeSituation(initialTargetProperties) {
    const {
      fireResizeEvent,
      useMockResizeObserver,
    } = createMockResizeObserverHook(initialTargetProperties)

    const testRef = { current: 'something' }
    const callback = jest.fn()
    renderHook(() => useMockResizeObserver(testRef, callback))

    return { fireResizeEvent, callback, testRef }
  }
})
