export function getArgsOfLastCall(mockFn) {
  const argsOfCalls = getArgsOfCalls(mockFn)
  return argsOfCalls[argsOfCalls.length - 1]
}

export function getArgsOfCalls(mockFn) {
  return mockFn.mock.calls
}
