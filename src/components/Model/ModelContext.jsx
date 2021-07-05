import React, { createContext } from 'react'
import useViewmodel from './useViewmodel'

export const ModelContext = createContext()

export function ModelProvider({ children, initialState }) {
  const newViewModel = useViewmodel({
    initialState,
  })

  return (
    <ModelContext.Provider value={newViewModel}>
      {children}
    </ModelContext.Provider>
  )
}
