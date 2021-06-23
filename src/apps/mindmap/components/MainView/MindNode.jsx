import NodeInput from './NodeInput'
import { NodeContainer, EmptyHeightSpan } from '../Styled'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function MindNode({ node }) {
  const nodeRef = useRef()
  const { editing, focused, text } = node

  const { positionStyle, size } = useSizeForPosition(nodeRef, node)

  useEffect(() => {
    if (focused && !editing) nodeRef.current?.focus()
  }, [focused, editing, nodeRef.current])

  return (
    <NodeContainer
      aria-label="node"
      ref={nodeRef}
      style={positionStyle}
      data-transparent={editing}
      {...getInteractionProps(node)}
    >
      {!editing && <EmptyHeightSpan>{text}</EmptyHeightSpan>}
      {editing && <NodeInput node={node} size={size} />}
    </NodeContainer>
  )
}

function getInteractionProps(node) {
  if (node.editing) return {}

  return {
    draggable: true,
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = 'move'
      node.do.handleDragStart(e)
    },
    onDragEnd: (e) => node.do.handleDragEnd(e),
    onClick: () => node.do.select?.(),
    onDoubleClick: (e) => {
      e.stopPropagation()
      node.do.startToEdit()
    },
    onKeyUp: ({ key }) => {
      key === 'Enter' && node.do.startToEdit()
      key === 'c' && node.do.createChild()
      key === 'f' && node.do.toggleFold()
    },
  }
}

const assumedEmptyNodeSize = { width: 16, height: 21 }

function useSizeForPosition(ref, node) {
  const [size, setSize] = useState(assumedEmptyNodeSize)
  const [positionStyle, setPositionStyle] = useState({})

  useLayoutEffect(() => {
    const newPositionStyle = computePositionStyle(node.centerOffset, size)
    setPositionStyle(newPositionStyle)
  }, [size.width, size.height, node.centerOffset])

  node?.use?.sizeObserver(ref, (e) => {
    const { width, height } = e.target.getBoundingClientRect()
    setSize({ width, height })
    node?.do?.registerSize({ width, height })
  })

  return { positionStyle, size }
}

function computePositionStyle(centerOffset, size) {
  if (!centerOffset || !size.width || !size.height) return {}
  return {
    '--position': 'absolute',
    '--left': `${centerOffset.left - size.width / 2}px`,
    '--top': `${centerOffset.top - size.height / 2}px`,
  }
}
