import React from 'react'
import styled from 'styled-components'

export default function Actions({ actions }) {
  const { createNode, undo, redo } = actions
  return (
    <FlexRow aria-label="actions">
      <button onClick={() => createNode()} aria-label="create root node">
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
