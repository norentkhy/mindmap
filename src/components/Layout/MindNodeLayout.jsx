import React, { useState, useRef } from 'react'
import styled from 'styled-components'

export default function MindNodeLayout({
  Content,
  useSizeObserver,
  editing,
  centerOffset,
  containerProps,
  inputProps,
  handleResize,
}) {
  const containerRef = useThisOrAlternativeRef(containerProps.ref)
  const size = useSize(useSizeObserver, containerRef, handleResize)
  const containerCssVariables = computeContainerCssVariables(centerOffset, size)
  const inputCssVariables = computeInputCssVariables(size)

  return (
    <NodeContainer
      aria-label="node"
      data-transparent={editing}
      style={containerCssVariables}
      {...containerProps}
    >
      <EmptyHeightDiv>{Content}</EmptyHeightDiv>
      {editing && (
        <Input
          aria-label="editing node"
          style={inputCssVariables}
          {...inputProps}
        />
      )}
    </NodeContainer>
  )
}

function useThisOrAlternativeRef(thisRef) {
  const alternativeRef = useRef()
  return thisRef || alternativeRef
}

function useSize(useSizeObserver, ref, handleResize) {
  const [size, setSize] = useState(assumedEmptyNodeSize)
  useSizeObserver?.(ref, ({ target }) => {
    const { width, height } = target.getBoundingClientRect()
    handleResize({ width, height })
    setSize({ width, height })
  })
  return size
}

function computeContainerCssVariables(centerOffset, size) {
  if (!centerOffset) return {}
  return {
    '--left': `${centerOffset.left - size.width / 2}px`,
    '--top': `${centerOffset.top - size.height / 2}px`,
  }
}

function computeInputCssVariables(size) {
  return {
    '--width': `${size.width}px`,
    '--height': `${size.height}px`,
  }
}

const assumedEmptyNodeSize = { width: 16, height: 15 }

const NodeContainer = styled.button`
  position: absolute;
  left: var(--left);
  top: var(--top);

  &[data-transparent='true'] {
    color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
`

const EmptyHeightDiv = styled.div`
  white-space: pre-line;

  &::before {
    content: '\\200b';
  }
`

const Input = styled.textarea`
  position: absolute;
  width: var(--width);
  height: var(--height);
  left: -2px;
  top: -2px;

  text-align: center;
  resize: none;
  font: inherit;
`
