import React from 'react'
import { useActions } from './useActions'

export function Actions({ useHook = useActions }) {
  const { undoAction, redoAction, createRootNode } = useHook()

  return (
    <div aria-label="actions">
      <button onClick={createRootNode} aria-label="create root node"></button>
      <button onClick={() => undoAction()} aria-label="undo action"></button>
      <button onClick={() => redoAction()} aria-label="redo action"></button>
    </div>
  )
}
