export function getArgsOfLastCall(jestFn) {
  const argumentsOfAllCalls = getArgsOfAllCalls(jestFn)
  const numberOfCalls = argumentsOfAllCalls.length
  return argumentsOfAllCalls[numberOfCalls - 1]
}

function getArgsOfAllCalls(jestFn) {
  return jestFn.mock.calls
}
