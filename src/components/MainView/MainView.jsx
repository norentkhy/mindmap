import MindNodes from './MindNodes'
import MindLinks from './MindLinks'
import { MindSpace } from '../Styled'
import React from 'react'

export default function MainView({ nodes, links = [], createNode, navigate, handleNodeDrop }) {
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
      <MindLinks links={links} />
      <MindNodes nodes={nodes} handleNodeDrop={handleNodeDrop} />
    </MindSpace>
  )
}

function preventDragEndAnimation(e) {
  e.preventDefault()
}
