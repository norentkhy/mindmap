import React, { createContext } from 'react'
import useViewmodel from './useViewmodel'

export const ModelContext = createContext()

export function ModelProvider({
  children,
  initialState,
  useThisResizeObserver,
  logResize = () => {},
}) {
  const newViewModel = useViewmodel({
    initialState,
    useThisResizeObserver,
    logResize,
  })

  return (
    <ModelContext.Provider value={newViewModel}>
      {children}
    </ModelContext.Provider>
  )
}
