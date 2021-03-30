import React from 'react'
import Button from './Button'
import NodeInput from './NodeInput'
import useNode from './useNode'

export default function Node({ node, theProjectContext }) {
  const {
    createChildNode,
    foldNode,
    initiateEditNode,
    editing,
    id,
    text,
    nodeRef,
  } = useNode({ node, theProjectContext })

  if (editing)
    return (
      <Button ref={nodeRef}>
        <NodeInput theProjectContext={theProjectContext} node={node} />
      </Button>
    )

  if (!editing)
    return (
      <Button
        ref={nodeRef}
        onKeyUp={({ key }) => {
          key === 'Enter' && initiateEditNode(id)
          key === 'c' && createChildNode(id)
          key === 'f' && foldNode(id)
        }}
      >
        {text}
      </Button>
    )
}
