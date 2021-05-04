import React, { createContext, memo, useContext, useRef, useState } from 'react'

function ContextRenderingBehaviour() {
  return (
    <ModelProvider>
      <Consumer />
      <div>
        <DisplayA />
        <button onClick={incrementA}>increment A</button>
      </div>
      <div>
        <DisplayB />
        <button onClick={incrementB}>increment B</button>
      </div>
    </ModelProvider>
  )
}

function ModelProvider({ children }) {
  console.log('rendering provider')
  const viewmodel = useModel()
  
  return (
    <Context.Provider value={viewmodel}>
      <button onClick={incrementCount}>change context</button>
      {children}
    </Context.Provider>
  )
}

function useModel() {
  const [count, setCount] = useState(0)
  viewmodel.__changes__.count = count
  viewmodel.__changes__.setCount = setCount

  return { ...viewmodel }
}

const viewmodel = {
  __changes__: {
    count: undefined,
    setCount: () => {},
    incrementCount,
  },
  state: {
    a: 0,
    b: 0,
  },
  actions: {
    incrementA,
    incrementB,
  },
}

function incrementCount() {
  viewmodel.__changes__.setCount(viewmodel.__changes__.count + 1)
}

function incrementA() {
  changeState(() => viewmodel.state.a++)
}

function incrementB() {
  changeState(() => viewmodel.state.b++)
}

function changeState(handleStateChange) {
  handleStateChange()
  incrementCount()
}

const Context = createContext()

function Consumer() {
  console.log('rendering consumer')
  const external = useContext(Context)

  return <div>{`current count: ${external.__changes__.count}`}</div>
}

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
    useContext(Context)
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
