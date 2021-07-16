import '@testing-library/jest-dom'

export { describe, test, expect } from '@jest/globals'

export const createMockFn = jest.fn

export function expectEqualExcludingFunctions(a: object, b: object) {
  const [excludedA, excludedB] = [a, b].map(excludeDeepFunctions)
  return expect(excludedA).toEqual(excludedB)
}

function excludeDeepFunctions(obj: object) {
  const newObj = { ...obj }
  const entries = Object.entries(newObj)
  entries.forEach(([key, value]) => {
    if (typeof value === 'function') delete newObj[key]
    if (typeof value === 'object' && value !== null)
      newObj[key] = excludeDeepFunctions(value)
  })
  return newObj
}
