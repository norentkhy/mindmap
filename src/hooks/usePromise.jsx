import { useRef } from 'react'
import useOnEffect from './useOnEffect'
import { cancelable } from 'cancelable-promise'

function usePromise() {
  const unmountsRef = useRef()

  useOnEffect([], () => {
    initializeListOfUnmounts()
    return cancelActivePromises
  })

  return { makeMountedPromise }

  function makeMountedPromise(promise) {
    const cancelablePromise = cancelable(promise)
    const mountedPromise = decorateWithOnCancel(cancelablePromise)
    updateListOfUnmounts(mountedPromise.cancel)

    return mountedPromise
  }

  function initializeListOfUnmounts() {
    unmountsRef.current = new Set()
  }

  function cancelActivePromises() {
    unmountsRef.current.forEach((unmount) => unmount())
  }

  function updateListOfUnmounts(unmount) {
    unmountsRef.current.add(unmount)
  }

  function removeFromListOfUnmounts(unmount) {
    unmountsRef.current.delete(unmount)
  }

  function decorateWithOnCancel(cancelablePromise) {
    let onCancelCallback = () => {}
    let firstDecorationOf = { then: true, catch: true, finally: true }

    const decoratedPromise = Object.assign({}, cancelablePromise, {
      then: decoratedThen,
      catch: decoratedCatch,
      finally: decoratedFinally,
      onCancel,
      cancel: cancelWithCallback,
    })

    return decoratedPromise

    function decoratedThen(...args) {
      if (firstDecorationOf.then) {
        return decorateCancelablePromiseAnd('then', ...args)
      } else {
        return decoratedPromise.then(...args)
      }
    }

    function decoratedCatch(...args) {
      if (firstDecorationOf.catch) {
        return decorateCancelablePromiseAnd('catch', ...args)
      } else {
        return decoratedPromise.catch(...args)
      }
    }

    function decoratedFinally(...args) {
      if (firstDecorationOf.finally) {
        return decorateCancelablePromiseAnd('finally', ...args)
      } else {
        return decoratedPromise.finally(...args)
      }
    }

    function decorateCancelablePromiseAnd(key, ...args) {
      firstDecorationOf[key] = false
      return decorateWithOnCancel(cancelablePromise[key](...args)).onCancel(
        onCancelCallback
      )
    }

    function onCancel(callback = () => {}) {
      onCancelCallback = callback
      return decoratedPromise
    }

    function cancelWithCallback() {
      onCancelCallback()
      removeFromListOfUnmounts(decoratedPromise.cancel)
      cancelablePromise.cancel()
    }
  }
}

export default usePromise
