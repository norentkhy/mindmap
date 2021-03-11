import React, { createContext } from 'react'

export function createMockContextProvider(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  const Context = createContext()

  return [Context, Provider]

  function Provider({ children }) {
    const model = { state: initialState, ...modifications }
    return <Context.Provider value={model}>{children}</Context.Provider>
  }
}
