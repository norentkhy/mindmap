import NodeInput from './NodeInput'
import { NodeContainer } from '../Styled'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function MindNode({ node }) {
  const nodeRef = useRef()
  const { editing, focused, text } = node

  const containerStyle = useContainerStyle(nodeRef, node)

  useEffect(() => {
    if (focused && !editing) nodeRef.current?.focus()
  }, [focused, editing, nodeRef.current])

  if (editing)
    return (
      <NodeContainer
        aria-label="node"
        ref={nodeRef}
        node={node}
        position={containerStyle}
      >
        <NodeInput node={node} />
      </NodeContainer>
    )

  if (!editing)
    return (
      <NodeContainer
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          node.do.handleDragStart(e)
        }}
        onDragEnd={(e) => node.do.handleDragEnd(e) }
        aria-label="node"
        ref={nodeRef}
        position={containerStyle}
        onClick={() => node.do.select?.()}
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
      </NodeContainer>
    )
}

function useContainerStyle(ref, node) {
  const [size, setSize] = useState({ width: 169, height: 27 })
  const [containerStyle, setContainerStyle] = useState({})

  useLayoutEffect(() => {
    const newContainerStyle =
      node?.compute?.containerStyle?.({
        width: size.width,
        height: size.height,
      }) || {}
    setContainerStyle(newContainerStyle)
  }, [size.width, size.height, node?.compute?.containerStyle])

  node?.use?.sizeObserver(ref, (e) => {
    const { width, height } = e.target.getBoundingClientRect()
    setSize({ width, height })
  })

  return containerStyle
}
