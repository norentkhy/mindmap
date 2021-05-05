import { viewmodel, view } from '~/test-utils'
import { ViewmodelProvider, withViewmodel, useViewmodel } from '~/components'
import React from 'react'

describe('useViewmodel', () => {
  const initialState = { counter: 0 }
  const computeActions = (state, updateState) => ({
    updateViewmodel: () => updateState({ counter: state.counter + 1 }),
  })

  const useTestModel = () => useViewmodel(initialState, computeActions)

  test.case('returns state and actions', ({ useTestModel }) => {
    const { state } = viewmodel.render(useTestModel)
    expect(state.get()).toBe(initialState)
  })([{ useTestModel }])

  test.case('single model update on first render', ({ useTestModel }) => {
    const { expectNumberOfRenders } = viewmodel.renderValidation(useTestModel)
    expectNumberOfRenders(1)
  })([{ useTestModel }])

  test.case('correct usage triggers one render', ({ useTestModel }) => {
    const { expectNumberOfRenders, actions } = viewmodel.renderValidation(
      useTestModel
    )
    actions.updateViewmodel()
    expectNumberOfRenders(2)
  })([{ useTestModel }])
})

describe('Viewmodel-Component connection', () => {
  test.case('with higher order component and context', ({ greeting }) => {
    const useTestModel = () => ({ greeting })
    const getPropsFromModel = (model) => ({ greeting: model.greeting })
    renderTest(useTestModel, getPropsFromModel)
    view.expect.text(greeting).toBeVisible()
  })([{ greeting: 'hello' }])

  function renderTest(useTestModel, getPropsFromTestModel) {
    const ComponentWithViewmodel = withViewmodel(
      DisplayGreeting,
      getPropsFromTestModel
    )

    return view.render(
      <ViewmodelProvider useViewmodel={useTestModel}>
        <ComponentWithViewmodel />
      </ViewmodelProvider>
    )
  }

  function DisplayGreeting({ greeting }) {
    return <div>{greeting}</div>
  }
})
