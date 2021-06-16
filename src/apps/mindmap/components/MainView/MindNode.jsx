import NodeInput from './NodeInput'
import { NodeContainer } from '../Styled'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function MindNode({ node }) {
  const nodeRef = useRef()
  const { editing, focused, text } = node

  const positionStyle = usePositionStyle(nodeRef, node)

  useEffect(() => {
    if (focused && !editing) nodeRef.current?.focus()
  }, [focused, editing, nodeRef.current])

  if (editing)
    return (
      <NodeContainer
        aria-label="node"
        ref={nodeRef}
        node={node}
        position={positionStyle}
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
        onDragEnd={(e) => node.do.handleDragEnd(e)}
        aria-label="node"
        ref={nodeRef}
        position={positionStyle}
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

function usePositionStyle(ref, node) {
  const [size, setSize] = useState({ width: 169, height: 27 })
  const [positionStyle, setPositionStyle] = useState({})

  useLayoutEffect(() => {
    const newPositionStyle = computePositionStyle(node.centerOffset, size)
    setPositionStyle(newPositionStyle)
  }, [size.width, size.height, node.centerOffset])

  node?.use?.sizeObserver(ref, (e) => {
    const { width, height } = e.target.getBoundingClientRect()
    setSize({ width, height })
    node?.do?.registerSize({width, height})
  })

  return positionStyle
}

function computePositionStyle(centerOffset, size) {
  if (!centerOffset || !size.width || !size.height) return {}
  return {
    position: 'absolute',
    left: `${centerOffset.left - size.width / 2}px`,
    top: `${centerOffset.top - size.height / 2}px`,
  }
}
