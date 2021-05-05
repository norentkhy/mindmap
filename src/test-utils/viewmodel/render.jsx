import { act, renderHook } from '@testing-library/react-hooks'
import { mapObject } from 'utils/FunctionalProgramming'
import { useEffect } from 'react'
import { viewmodel } from './index'

export { renderViewmodel, renderViewmodelValidation }

function renderViewmodel(useModel) {
  const { result } = renderHook(useModel)

  return {
    state: getStateHandlers(result),
    actions: getActionHandlers(result),
  }
}

function getStateHandlers(result) {
  return {
    get: () => getState(result),
  }
}

function getState(result) {
  return result.current.state
}

function getActionHandlers(result) {
  const { actions } = result.current
  return mapObject(actions, withAct)
}

function withAct(handleAction) {
  return (...args) => act(() => handleAction(...args))
}

function renderViewmodelValidation(useModel) {
  const confirmModelUpdate = viewmodel.createMock.function()

  const useModelValidator = createModelValidationHook(
    useModel,
    confirmModelUpdate
  )
  const model = renderViewmodel(useModelValidator)

  return {
    ...model,
    expectNumberOfRenders: (amount) =>
      viewmodel.expect.mockFunction(confirmModelUpdate).toBeCalledTimes(amount),
  }
}

function createModelValidationHook(useModel, confirmModelChange) {
  return useModelValidator

  function useModelValidator() {
    const model = useModel()

    useEffect(() => {
      confirmModelChange()
    }, [model])

    return model
  }
}
