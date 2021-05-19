import MindNode from './MindNode'
import { MindSpace } from '../Styled'
import React from 'react'

export function MainView({ nodes, createNode }) {
  return (
    <MindSpace aria-label="main view" onDoubleClick={createNode}>
      {nodes?.map((node) => (
        <MindNode key={node.id} node={node} />
      ))}
    </MindSpace>
  )
}
