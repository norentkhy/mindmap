import { inspect } from 'util'

export function logInputAndOutputOf(fn) {
  return functionWithLogs

  function functionWithLogs(...args) {
    console.log(`log event of ${fn}`)

    console.log(`input: ${args}`)
    const value = fn(...args)
    console.log(`output: ${value}`)

    return value
  }
}

export function logVerbose(value) {
  console.log(inspect(value, { showHidden: false, depth: null }))
}
