import React, { useContext, useState } from 'react'
import { createContextProvider } from 'utils/react-templates'

const [ViewmodelContext, ValueProvider] = createContextProvider()

function ViewmodelProvider({ useViewmodel, ...props }) {
  return ValueProvider({ ...props, useValue: useViewmodel })
}

function withViewmodel(Component, getFromViewmodel) {
  return ComponentWithViewmodel

  function ComponentWithViewmodel(givenProps) {
    const viewmodel = useContext(ViewmodelContext)
    const subscribedProps = getFromViewmodel(viewmodel)
    const props = { ...subscribedProps, ...givenProps }
    return <Component {...props} />
  }
}

function useViewmodel(initialState, computeActions) {
  const [state, setState] = useState(initialState)
  const actions = computeActions(state, setState)

  return { state, actions }
}

export { ViewmodelContext, ViewmodelProvider, withViewmodel, useViewmodel }
