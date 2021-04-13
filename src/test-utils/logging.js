import { inspect } from 'util'

export function logInputAndOutputOf(targetFunction) {
  return functionWithLogs

  function functionWithLogs(...input) {
    const output = targetFunction(...input)
    logVerbose({ targetFunction, input, output })
    return output
  }
}

export function logVerbose(value) {
  console.log(getVerboseForm(value))
}

function getVerboseForm(obj) {
  return inspect(obj, { showHidden: false, depth: null })
}
