import React from 'react'
import MindMapApp from 'src/apps/mindmap/App'

function MindMapInstance() {
  return <MindMapApp logResize={console.log} />
}

export default { title: 'MindMap' }
export { MindMapInstance }
