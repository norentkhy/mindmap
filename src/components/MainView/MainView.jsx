import { MainViewLayout } from '../Layout'
import MindNodes from './MindNodes'
import MindLinks from './MindLinks'
import React from 'react'

export default function MainView({
  nodes,
  links = [],
  createNode,
  navigate,
  handleNodeDrop,
}) {
  return (
    <MainViewLayout
      MindNodes={<MindNodes nodes={nodes} handleNodeDrop={handleNodeDrop} />}
      MindLinks={<MindLinks links={links} />}
      eventListeners={{
        onDoubleClick: createNode,
        onDragOver: preventDragEndAnimation,
        onKeyDown: ({ key }) => {
          key === 'ArrowLeft' && navigate('left')
          key === 'ArrowRight' && navigate('right')
          key === 'ArrowUp' && navigate('up')
          key === 'ArrowDown' && navigate('down')
        },
      }}
    />
  )
}

function preventDragEndAnimation(e) {
  e.preventDefault()
}
