import '@testing-library/jest-dom'
import 'babel-polyfill'
import 'jest-extended'

test.case = testCase

function testCase(name, fn, timeout) {
  const fulfillPromise = createPromiseToExecuteTestCase(name, timeout)

  return (args) => {
    fulfillPromise(name)
    test.each(args)(name, fn, timeout)
  }
}

function createPromiseToExecuteTestCase(name, timeout) {
  var fulfillPromise
  const promiseNoOpenHandle = new Promise(
    (resolve) => (fulfillPromise = resolve)
  )

  test(`execute test case: ${name}`, expectPromiseToBeFulfilled, timeout)
  async function expectPromiseToBeFulfilled() {
    const promisedName = await promiseNoOpenHandle
    expect(promisedName).toBe(name)
  }

  return fulfillPromise
}
