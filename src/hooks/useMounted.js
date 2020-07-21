import { useRef } from 'react'
import useOnEffect from './useOnEffect'
import AggregateError from 'aggregate-error'

function useMounted() {
  const mountedRef = useRef()

  useOnEffect([], () => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  })

  return { makeMountedPromise, isMounted }

  function makeMountedPromise(promise, handleUnmount) {
    const mountedPromise = new Promise((resolve, reject) => {
      const unmountedError = new Error('useMounted: hook is unmounted')

      promise
        .then((value) => {
          if (isMounted()) resolve(value)
          else reject(unmountedError)
        })
        .catch((error) => {
          if (isMounted()) reject(error)
          else reject(new AggregateError([unmountedError, error]))
        })
        .finally(() => {
          if (!isMounted() && handleUnmount) handleUnmount()
        })
    })

    return mountedPromise
  }

  function isMounted() {
    return mountedRef.current
  }
}

export default useMounted
