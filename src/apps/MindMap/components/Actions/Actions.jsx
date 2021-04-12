import React, { useContext } from 'react'
import styled from 'styled-components'
import { ProjectContext } from '~mindmap/components/Contexts/ProjectContext'

export function Actions({ theProjectContext = ProjectContext }) {
  const { undo, redo, createRootNode } = useContext(theProjectContext)

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
