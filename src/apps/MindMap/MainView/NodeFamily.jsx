import React from 'react'
import determineNodesToRender from './determineNodesToRender'
import Node from './Node'

export default function NodeFamily({ headNode, theProjectContext }) {
  const nodesToRender = determineNodesToRender(headNode)

  return (
    <div>
      <Node
        node={headNode}
        key={headNode.id}
        theProjectContext={theProjectContext}
      />
      {nodesToRender?.map((node) => (
        <NodeFamily
          headNode={node}
          key={node.id}
          theProjectContext={theProjectContext}
        />
      ))}
    </div>
  )
}
