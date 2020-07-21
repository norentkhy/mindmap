import usePromise from './usePromise'
import { renderHook, act } from '@testing-library/react-hooks'
import { describe, expect, it } from '@jest/globals'

describe('usePromise', () => {
  describe('makeMounted()', () => {
    it('has function makeMountedPromise()', () => {
      const { result } = renderHook(() => usePromise())
      expect(result.current.makeMountedPromise).toBeInstanceOf(Function)
    })

    it('resolves normally when mounted', async () => {
      const { result } = renderHook(() => usePromise())
      const resolve = jest.fn()
      await result.current.makeMountedPromise(Promise.resolve()).then(resolve)
      expect(resolve).toBeCalled()
    })

    it('rejects normally when mounted', async () => {
      const { result } = renderHook(() => usePromise())
      const reject = jest.fn()
      await result.current.makeMountedPromise(Promise.reject()).catch(reject)
      expect(reject).toBeCalled()
    })

    test('manual cancel on resolve', () => {
      const { result } = renderHook(() => usePromise())

      act(() => {
        const promise = result.current.makeMountedPromise(Promise.resolve())
        promise.cancel()
        expect(promise.isCanceled()).toBe(true)
      })
    })

    test('manual cancel on reject', async () => {
      const { result } = renderHook(() => usePromise())

      let promise
      act(() => {
        const handleError = jest.fn()
        promise = result.current
          .makeMountedPromise(Promise.reject())
          .catch(handleError)
        promise.cancel()

        expect(promise.isCanceled()).toBe(true)
        expect(handleError).not.toHaveBeenCalled()
      })
    })

    it('does not resolve, but rejects instead when unmounted', async () => {
      const { result, unmount } = renderHook(() => usePromise())

      let promise
      act(() => {
        promise = result.current.makeMountedPromise(Promise.resolve())
        unmount()
      })

      expect(promise.isCanceled()).toBe(true)
    })

    it('rejects with unmounted error when unmounted', async () => {
      const { result, unmount } = renderHook(() => usePromise())

      let promise
      const handleError = jest.fn()
      act(() => {
        promise = result.current
          .makeMountedPromise(Promise.reject())
          .catch(handleError)
        unmount()
      })

      expect(promise.isCanceled()).toBe(true)
      expect(handleError).not.toHaveBeenCalled()
    })

    it('onCancel registers a callback on cancelled resolving Promise', () => {
      const { result } = renderHook(() => usePromise())

      let promise
      let handleCancel = jest.fn()
      act(() => {
        promise = result.current
          .makeMountedPromise(Promise.resolve())
          .onCancel(handleCancel)
        promise.cancel()
      })

      expect(handleCancel).toHaveBeenCalled()
    })

    it('onCancel registers a callback on cancelled rejecting Promise', () => {
      const { result } = renderHook(() => usePromise())

      let promise
      const handleCancel = jest.fn()
      act(() => {
        promise = result.current
          .makeMountedPromise(Promise.reject())
          .catch(() => {})
          .onCancel(handleCancel)
        promise.cancel()
      })

      expect(handleCancel).toHaveBeenCalled()
    })

    it('order ignorance of onCancel in promise chain', () => {
      const { result } = renderHook(() => usePromise())

      let promise
      const handleCancel = jest.fn()
      act(() => {
        promise = result.current
          .makeMountedPromise(Promise.reject())
          .onCancel(handleCancel)
          .catch(() => {})
        promise.cancel()
      })

      expect(handleCancel).toHaveBeenCalled()
    })

    it('then chaining', async () => {
      const { result } = renderHook(() => usePromise())

      let promise
      const handleResolve = jest.fn()
      act(() => {
        result.current
          .makeMountedPromise(Promise.resolve())
          .then(handleResolve)
          .then(handleResolve)
          .then(handleResolve)
      })
      await promise
      await promise
      await promise

      expect(handleResolve).toHaveBeenCalledTimes(3)
    })

    it('multiple fully defined promises', () => {
      const { result } = renderHook(() => usePromise())

      let promiseSuccess, promiseFailure
      const [
        resolve1,
        reject1,
        finally1,
        onCancel1,
        resolve2,
        reject2,
        finally2,
        onCancel2,
      ] = makeJestFns(8)

      act(() => {
        promiseSuccess = result.current
          .makeMountedPromise(Promise.resolve())
          .then(resolve1)
          .catch(reject1)
          .finally(finally1)
          .onCancel(onCancel1)

        promiseFailure = result.current
          .makeMountedPromise(Promise.reject())
          .then(resolve2)
          .catch(reject2)
          .finally(finally2)
          .onCancel(onCancel2)

        promiseSuccess.cancel()
        promiseFailure.cancel()
      })

      expect(resolve1).not.toHaveBeenCalled()
      expect(reject1).not.toHaveBeenCalled()
      expect(finally1).not.toHaveBeenCalled()
      expect(onCancel1).toHaveBeenCalled()

      expect(resolve2).not.toHaveBeenCalled()
      expect(reject2).not.toHaveBeenCalled()
      expect(finally2).not.toHaveBeenCalled()
      expect(onCancel2).toHaveBeenCalled()
    })
  })
})

function makeJestFns(amount) {
  return Array.from(Array(amount), () => jest.fn())
}
