import React, { useEffect, useRef } from 'react'
import NodeInput from './NodeInput'

export default function MindNode({ node }) {
  const nodeRef = useRef()
  const {
    editing,
    text,
    startToEditThisNode,
    toggleFoldOnThisNode,
    createChildOfThisNode,
  } = node

  useEffect(() => {
    !editing && nodeRef.current?.focus()
  }, [editing])

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
        onKeyUp={({ key }) => {
          key === 'Enter' && startToEditThisNode()
          key === 'c' && createChildOfThisNode()
          key === 'f' && toggleFoldOnThisNode()
        }}
      >
        {text}
      </button>
    )
}
