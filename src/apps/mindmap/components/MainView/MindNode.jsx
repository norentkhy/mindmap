import React, { useEffect, useRef } from 'react'
import NodeInput from './NodeInput'

export default function MindNode({ node }) {
  const nodeRef = useRef()
  const { editing, focused, text } = node

  useEffect(() => {
    if (focused && !editing) nodeRef.current?.focus()
  }, [focused, editing, nodeRef.current])

  if (editing)
    return (
      <button aria-label="node" ref={nodeRef} node={node}>
        <NodeInput node={node} />
      </button>
    )

  if (!editing)
    return (
      <button
        aria-label="node"
        ref={nodeRef}
        onDoubleClick={(e) => {
          e.stopPropagation()
          node.do.startToEdit()
        }}
        onKeyUp={({ key }) => {
          key === 'Enter' && node.do.startToEdit()
          key === 'c' && node.do.createChild()
          key === 'f' && node.do.toggleFold()
        }}
      >
        {text}
      </button>
    )
}
