import { expect } from '@jest/globals'

export const expectations = {
  mockFunction: expectMockFunction,
}

function expectMockFunction(mockFn) {
  const expectSubject = expect(mockFn)
  return {
    toBeCalled: expectSubject.toBeCalled,
    toBeCalledTimes: expectSubject.toBeCalledTimes,
    toBeCalledWith: expectSubject.toBeCalledWith,
    nthCalledWith: expectSubject.nthCalledWith,
    not: {
      toBeCalled: expectSubject.not.toBeCalled,
      toBeCalledTimes: expectSubject.not.toBeCalledTimes,
      toBeCalledWith: expectSubject.not.toBeCalledWith,
      nthCalledWith: expectSubject.not.nthCalledWith,
    },
  }
}
