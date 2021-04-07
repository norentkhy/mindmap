import React, { useContext } from 'react'
import { ProjectContext } from '../Contexts/ProjectContext'
import determineNodesToRender from './determineNodesToRender'
import NodeFamily from './NodeFamily'

export function MainView({ theProjectContext = ProjectContext }) {
  const { state, createRootNode } = useContext(theProjectContext)
  const nodesToRender = determineNodesToRender(state)

  return (
    <div aria-label="main view" onDoubleClick={createRootNode}>
      {nodesToRender?.map((node) => (
        <div key={`container ${node.id}`} aria-label="container of rootnode">
          <NodeFamily
            headNode={node}
            key={node.id}
            theProjectContext={theProjectContext}
          />
        </div>
      ))}
    </div>
  )
}
