import React, { createContext } from 'react'

function createContextProvider() {
  const Context = createContext()

  return [Context, Provider]

  function Provider({ children, useValue }) {
    const value = useValue()
    return <Context.Provider value={value}>{children}</Context.Provider>
  }
}

export { createContextProvider }
