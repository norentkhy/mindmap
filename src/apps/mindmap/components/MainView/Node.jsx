import React, { useEffect } from 'react'
import Button from './Button'
import NodeInput from './NodeInput'
import useNode from './useNode'

export default function Node({ node, useThisModel }) {
  const {
    createChildNode,
    foldNode,
    initiateEditNode,
    editing,
    id,
    text,
    nodeRef,
  } = useNode({ node, useThisModel })

  useEffect(() => {
    !editing && nodeRef.current?.focus()
  }, [editing])

  if (editing)
    return (
      <Button aria-label="node" ref={nodeRef} node={node}>
        <NodeInput useThisModel={useThisModel} node={node} />
      </Button>
    )

  if (!editing)
    return (
      <Button
        aria-label="node"
        ref={nodeRef}
        node={node}
        onKeyUp={({ key }) => {
          key === 'Enter' && initiateEditNode({ id })
          key === 'c' && createChildNode({ parentId: id })
          key === 'f' && foldNode({ id })
        }}
      >
        {text}
      </Button>
    )
}
