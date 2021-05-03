import React from 'react'
import MindMapApp from '../App'

function MindMapInstance() {
  return <MindMapApp logResize={console.log} />
}

export default { title: 'MindMap' }
export { MindMapInstance }
