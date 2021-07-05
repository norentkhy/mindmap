import { mapObject } from 'src/utils/FunctionalProgramming'
import { act } from '@testing-library/react-hooks'

export function getActions(result) {
  const { state, ...actions } = result.current
  const wrappedActions = mapObject(actions, wrapActionInAct)

  return wrappedActions

  function wrapActionInAct(doAction) {
    return (...args) => act(() => doAction(...args))
  }
}
