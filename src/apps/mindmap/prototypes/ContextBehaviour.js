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

  return <Context.Provider value={viewmodel}>{children}</Context.Provider>
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
    actions[name] = composeAction(spec, modelRef, triggerRerender)
    return actions
  })
}

function composeAction(spec, modelRef, triggerRerender) {
  return (...args) => {
    const state = getState(modelRef)
    const newState = calculateNewState(spec, args, state)
    setState(modelRef, newState)
    triggerRerender()
  }
}

function calculateNewState(spec, args, state) {
  const { getInputArgs, calculate, modifyOutputInState } = spec

  return produceObject(state, (draftState) => {
    const inputArgs = getInputArgs(args, draftState)
    const output = calculate(...inputArgs)
    modifyOutputInState(output, draftState)
  })
}

function produceObject(obj, modify) {
  const [proxyObj, newObject] = createCopyOnWriteProxy(obj)
  modify(proxyObj)
  return newObject
}

function createCopyOnWriteProxy(obj) {
  const newObject = { ...obj }
  const proxy = createModificationsProxy(newObject, [], modifyNewObject)

  return [proxy, newObject]

  function modifyNewObject(keys, value) {
    const [key, ...restOfKeys] = keys
    newObject[key] = nestedUpdate(newObject, restOfKeys, () => value)
  }
}

function createModificationsProxy(obj, keys, register) {
  return new Proxy(obj, {
    get: getDeeperProxyIfValidTargetKey,
    set: registerModification,
  })

  function getDeeperProxyIfValidTargetKey(target, key) {
    const subject = target?.[key]
    if (isDeeperProxyRequest(subject)) {
      return createModificationsProxy(subject, [...keys, key], register)
    }
    return subject
  }

  function registerModification(_target, key, value) {
    register([...keys, key], value)
    return true
  }
}

function isDeeperProxyRequest(subject) {
  return typeof subject === 'object'
}

function nestedUpdate(object, keys, modify) {
  if (keys.length === 0) return modify(object)
  const [key, ...restOfKeys] = keys
  return update(object, key, (value) => nestedUpdate(value, restOfKeys, modify))
}

function update(object, key, modify) {
  var value = object[key]
  var newValue = modify(value)
  var newObject = objectSet(object, key, newValue)
  return newObject
}

function objectSet(object, key, newValue) {
  const objectCopy = { ...object }
  objectCopy[key] = newValue
  return objectCopy
}

function setState(modelRef, newState) {
  modelRef.current.state = newState
}

const actionSpecifications = {
  incrementA: {
    getInputArgs: (_args, state) => [state.a],
    calculate: increment,
    modifyOutputInState: (output, newState) => (newState.a = output),
  },
  incrementB: {
    getInputArgs: (_args, state) => [state.b],
    calculate: increment,
    modifyOutputInState: (output, newState) => (newState.b = output),
  },
}

function increment(x) {
  return x + 1
}

const initialModel = {
  state: {
    a: 13,
    b: 37,
    deeper: {
      than: {
        deep: true
      }
    }
  },
}

const Button = styled.button``

const ButtonA = withViewmodel(Button, (viewmodel) => ({
  onClick: viewmodel.actions.incrementA,
}))

const ButtonB = withViewmodel(Button, (viewmodel) => ({
  onClick: viewmodel.actions.incrementB,
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
