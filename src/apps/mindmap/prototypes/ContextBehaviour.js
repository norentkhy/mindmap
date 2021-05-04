import React, { createContext, memo, useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { reduceObject } from 'utils/FunctionalProgramming'

function ContextRenderingBehaviour() {
  return (
    <ModelProvider>
      <div>
        <DisplayA />
        <ButtonA>increment A</ButtonA>
      </div>
      <div>
        <DisplayB />
        <ButtonB>increment B</ButtonB>
      </div>
    </ModelProvider>
  )
}

function ModelProvider({ children }) {
  console.log('rendering provider')
  const viewmodel = useModel(initialModel)

  return (
    <Context.Provider value={viewmodel}>
      {children}
    </Context.Provider>
  )
}

const Context = createContext()

function useModel(initialModel) {
  const [count, setCount] = useState(0)
  console.log(`number of state updates: ${count}`)

  const modelRef = useRef(initialModel)
  syncModel({ modelRef, triggerRerender: () => setCount(count + 1) })

  return { ...modelRef.current }
}

function syncModel({ modelRef, triggerRerender }) {
  modelRef.current = {
    state: getState(modelRef),
    actions: linkModelActions(modelRef, triggerRerender),
  }
}

function getState(modelRef) {
  return modelRef.current.state
}

function linkModelActions(modelRef, triggerRerender) {
  return reduceObject(actionSpecifications, {}, (actions, [name, spec]) => {
    actions[name] = realizeActionSpecification(spec, modelRef, triggerRerender)
    return actions
  })
}

function realizeActionSpecification(spec, modelRef, triggerRerender) {
  const { getInputArgs, calculate, setState } = spec
  return (...args) => {
    const state = getState(modelRef)
    const inputArgs = getInputArgs(args, state)
    const output = calculate(...inputArgs)
    setState(state, output)
    triggerRerender()
  }
}

const actionSpecifications = {
  incrementA: {
    getInputArgs: (_args, state) => [state.a],
    calculate: increment,
    setState: (newState, output) => (newState.a = output),
  },
  incrementB: {
    getInputArgs: (_args, state) => [state.b],
    calculate: increment,
    setState: (newState, output) => (newState.b = output),
  },
}

function increment(x) {
  return x + 1
}

const initialModel = {
  state: {
    a: 13,
    b: 37,
  },
}

const Button = styled.button``

const ButtonA = withViewmodel(Button, (viewmodel) => ({
  onClick: viewmodel.actions.incrementA
}))

const ButtonB = withViewmodel(Button, viewmodel => ({
  onClick: viewmodel.actions.incrementB
}))

const DisplayA = withViewmodel(Display, (viewmodel) => ({
  value: viewmodel.state.a,
  label: 'a',
}))

const DisplayB = withViewmodel(Display, (viewmodel) => ({
  value: viewmodel.state.b,
  label: 'b',
}))

function withViewmodel(Component, extractProps) {
  console.log('creating HOC withViewmodel')
  const ComponentMemo = memo(Component)

  return ComponentWithViewModel

  function ComponentWithViewModel(propsGiven) {
    console.log('rendering withViewmodel')
    const viewmodel = useContext(Context)
    const props = { ...extractProps(viewmodel), ...propsGiven }
    return <ComponentMemo {...props} />
  }
}

function Display({ label, value }) {
  console.log(`rendering Display ${label}`)
  return <div>{`${label} has value ${value}`}</div>
}

export default { title: 'proofs of concept' }
export { ContextRenderingBehaviour }
