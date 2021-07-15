import { definedElementExpects } from './expectations'
import { waitFor } from '../dependency-wrappers'
import { mapObject } from 'src/utils/FunctionalProgramming'

const waitForDefinedElement = mapObject(
  definedElementExpects,
  (getExpectOptions) => getWaitForOptions({ getExpectOptions })
)

export const waitForExpectation = {
  ...waitForDefinedElement,
}

export function getWaitForOptions({
  getExpectOptions,
  structureSample = definedElementExpects.nodeInput(),
}) {
  return (...args) =>
    proxyWaitFor({
      getTarget: () => getExpectOptions(...args),
      facade: structureSample,
    })

  function proxyWaitFor({ getTarget, facade }) {
    return new Proxy(facade, { get: getWaitFor })

    function getWaitFor(facade, key) {
      if (isDeeperProxyRequest(facade, key))
        return proxyWaitFor({
          getTarget: () => getTarget()[key],
          facade: facade[key],
        })

      return (...keyArgs) =>
        waitFor(() => {
          const target = getTarget()
          if (key in target) return target[key](...keyArgs)
          throwPropertiesError(target, key)
        })
    }
  }

  function isDeeperProxyRequest(target, key) {
    return typeof target[key] === 'object' && target[key] !== null
  }
}

function throwPropertiesError(target, key) {
  throw new Error(
    `${key} is not part of the available properties:` +
      Object.keys(target)
        .map((key) => `\n- ${key}`)
        .join('')
  )
}
