import React from 'react'
import styled from 'styled-components'
import useModel from '~mindmap/hooks/useModel'

export function Actions({ useThisModel, actions }) {
  // if (!actions) return OldActions({ useThisModel })

  const { createRootNode, undo, redo } = actions
  return (
    <FlexRow aria-label="actions">
      <button onClick={createRootNode} aria-label="create root node">
        create root node
      </button>
      <button onClick={() => undo()} aria-label="undo action">
        undo action
      </button>
      <button onClick={() => redo()} aria-label="redo action">
        redo action
      </button>
    </FlexRow>
  )
}

export function OldActions({ useThisModel = useModel }) {
  const { undo, redo, createRootNode } = useThisModel()

  return (
    <FlexRow aria-label="actions">
      <button onClick={createRootNode} aria-label="create root node">
        create root node
      </button>
      <button onClick={() => undo()} aria-label="undo action">
        undo action
      </button>
      <button onClick={() => redo()} aria-label="redo action">
        redo action
      </button>
    </FlexRow>
  )
}

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`
