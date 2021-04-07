import React from 'react'
import styled from 'styled-components'
import { useActions } from './useActions'

export function Actions({ useHook = useActions }) {
  const { undoAction, redoAction, createRootNode } = useHook()

  return (
    <FlexRow aria-label="actions">
      <button onClick={createRootNode} aria-label="create root node">
        create root node
      </button>
      <button onClick={() => undoAction()} aria-label="undo action">
        undo action
      </button>
      <button onClick={() => redoAction()} aria-label="redo action">
        redo action
      </button>
    </FlexRow>
  )
}

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`
