import MindNode from './MindNode'
import React, { useRef } from 'react'
import styled from 'styled-components'

export default function MindNodes({ nodes, handleNodeDrop }) {
  const ref = useRef()

  return (
    <NodeSpace
      aria-label="node space"
      ref={ref}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleNodeDrop(e, ref.current)}
    >
      {nodes?.map((node) => (
        <MindNode key={node.id} node={node} parentRef={ref} />
      ))}
    </NodeSpace>
  )
}

const NodeSpace = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`
