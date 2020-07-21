import useMounted from './useMounted'
import { renderHook } from '@testing-library/react-hooks'

describe('isMounted', () => {
  test('mounted', async () => {
    const { isMounted } = renderUseMounted()
    expect(isMounted()).toBe(true)
  })

  test('unmounted', async () => {
    const { isMounted, unmount } = renderUseMounted()
    unmount()
    expect(isMounted()).toBe(false)
  })
})

describe('makeMountedPromise is a normal promise when hook stays mounted', () => {
  test('mounted resolve', async () => {
    const handleResolve = jest.fn()
    const handleReject = jest.fn()

    const { makeMountedPromise } = renderUseMounted()
    await makeMountedPromise(Promise.resolve())
      .then(handleResolve)
      .catch(handleReject)

    expect(handleResolve).toBeCalled()
    expect(handleReject).not.toBeCalled()
  })

  test('mounted reject', async () => {
    const handleResolve = jest.fn()
    const handleReject = jest.fn()

    const { makeMountedPromise } = renderUseMounted()
    await makeMountedPromise(Promise.reject())
      .then(handleResolve)
      .catch(handleReject)

    expect(handleResolve).not.toBeCalled()
    expect(handleReject).toBeCalled()
  })

  test('mounted finally after then', async () => {
    const handleResolve = jest.fn()
    const handleReject = jest.fn()
    const handleFinally = jest.fn()

    const { makeMountedPromise } = renderUseMounted()
    await makeMountedPromise(Promise.resolve())
      .then(handleResolve)
      .catch(handleReject)
      .finally(handleFinally)

    expect(handleReject).not.toBeCalled()
    expect(handleFinally).toHaveBeenCalledAfter(handleResolve)
  })

  test('mounted finally after reject', async () => {
    const handleResolve = jest.fn()
    const handleReject = jest.fn()
    const handleFinally = jest.fn()

    const { makeMountedPromise } = renderUseMounted()
    await makeMountedPromise(Promise.reject())
      .then(handleResolve)
      .catch(handleReject)
      .finally(handleFinally)

    expect(handleResolve).not.toBeCalled()
    expect(handleFinally).toHaveBeenCalledAfter(handleReject)
  })
})

describe('makeMountedPromise alters behaviour when hook is unmounted', () => {
  const unmountedError = new Error('useMounted: hook is unmounted')

  test('no resolve when unmounted', async () => {
    let handledError
    const handleResolve = jest.fn()
    const handleReject = jest.fn((error) => {
      handledError = error
    })

    const { makeMountedPromise, unmount } = renderUseMounted()
    const mountedPromise = makeMountedPromise(Promise.resolve())
      .then(handleResolve)
      .catch(handleReject)
    unmount()

    await mountedPromise

    expect(handleResolve).not.toBeCalled()
    expect(handleReject).toBeCalled()
    expect(handledError).toEqual(unmountedError)
  })

  test('reject with aggregrated error when unmounted', async () => {
    let handledError
    const handleResolve = jest.fn()
    const handleReject = jest.fn((error) => {
      handledError = error
    })

    const { makeMountedPromise, unmount } = renderUseMounted()
    const mountedPromise = makeMountedPromise(Promise.reject())
      .then(handleResolve)
      .catch(handleReject)
    unmount()

    await mountedPromise

    const firstHandledError = handledError._errors[0]
    expect(handleResolve).not.toBeCalled()
    expect(handleReject).toBeCalled()
    expect(firstHandledError).toEqual(unmountedError)
  })

  test('no handleUnmount when mounted', async () => {
    const handleResolve = jest.fn()
    const handleUnmount = jest.fn()

    const { makeMountedPromise } = renderUseMounted()
    await makeMountedPromise(Promise.resolve(), handleUnmount).then(
      handleResolve
    )

    expect(handleResolve).toBeCalled()
    expect(handleUnmount).not.toBeCalled()
  })

  test('handleUnmount when unmounted', async () => {
    let counter = 0
    const handleResolve = jest.fn()
    const handleReject = jest.fn()
    const handleUnmount = jest.fn(() => counter++)

    const { makeMountedPromise, unmount } = renderUseMounted()
    const mountedPromise = makeMountedPromise(Promise.resolve(), handleUnmount)
      .then(handleResolve)
      .catch(handleReject)

    unmount()
    await mountedPromise

    expect(handleUnmount).toBeCalled()
  })
})

function renderUseMounted() {
  const { result, unmount } = renderHook(() => useMounted())
  const { makeMountedPromise, isMounted } = result.current

  return { makeMountedPromise, isMounted, unmount }
}
