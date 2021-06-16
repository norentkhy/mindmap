import MindNodes from './MindNodes'
import MindLinks from './MindLinks'
import { MindSpace } from '../Styled'
import React from 'react'

export function MainView({ nodes, links = [], createNode, navigate }) {
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
      <MindNodes nodes={nodes} />
    </MindSpace>
  )
}

function preventDragEndAnimation(e) {
  e.preventDefault()
}
