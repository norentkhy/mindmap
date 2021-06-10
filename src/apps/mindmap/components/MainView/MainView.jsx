import MindNode from './MindNode'
import { MindSpace } from '../Styled'
import React from 'react'

export function MainView({ nodes, createNode, navigate }) {
  return (
    <MindSpace
      aria-label="main view"
      onDoubleClick={createNode}
      onDragOver={preventDragEndAnimation}
      onKeyDown={({ key }) => {
        key === 'ArrowLeft' && navigate('left')
        key === 'ArrowRight' && navigate('right')
        key === 'ArrowUp' && navigate('up')
        key === 'ArrowDown' && navigate('down')
      }}
    >
      {nodes?.map((node) => (
        <MindNode key={node.id} node={node} />
      ))}
    </MindSpace>
  )
}

function preventDragEndAnimation(e) {
  e.preventDefault() 
}
