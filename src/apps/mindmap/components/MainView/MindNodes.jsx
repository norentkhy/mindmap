import MindNode from './MindNode'
import React from 'react'
import styled from 'styled-components'

export default function MindNodes({ nodes }) {
  return (
    <NodeSpace aria-label="node space">
      {nodes?.map((node) => (
        <MindNode key={node.id} node={node} />
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
