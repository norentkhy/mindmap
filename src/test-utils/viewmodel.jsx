import useViewmodel from 'src/components/Model/useViewmodel'
import { renderHook } from '@testing-library/react-hooks'

export { act } from '@testing-library/react-hooks'
export {
  describe,
  test,
  expect,
  createMockFn,
  expectEqualExcludingFunctions,
} from './dependencies'

export function expectAnId() {
  return expect.any(String)
}

export function renderViewmodel() {
  const { result } = renderHook(useViewmodel)

  return new Proxy(result.current, {
    get: (_target, prop) => result.current[prop],
    set: () => {
      throw new Error('modify state using the viewmodel handlers')
    },
  })
}
