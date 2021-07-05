import useResizeObserver from '@react-hook/resize-observer'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

// DA PLAN
// 1. render each rootnode with a div containing its whole nodetree
// 2. register the dimensions
// 3. render lines based on registered relations and registered dimensions!
// THIS ALL KINDA IS GOOD WHEN USING LINKED LISTS

function LinesBetweenDivsInstance() {
  return (
    <div style={{ position: 'relative' }}>
      <Node
        node={{
          id: 1,
          text: 'hi',
          children: [
            { id: 2, text: 'child 1', siblingIndex: 0 },
            { id: 3, text: 'child 2', siblingIndex: 1 },
          ],
        }}
      />
      <Relation />
    </div>
  )
}

function Node({ node: { text, children, siblingIndex = 0 } }) {
  const ref = useRef()
  useResizeObserver(ref, (e) => {
    console.log('use this to update relation dimensions')
    console.log(e.target.getBoundingClientRect())
  })

  return (
    <Flex>
      <HeightDefined ref={ref} siblingIndex={siblingIndex}>
        {text}
      </HeightDefined>
      {children?.length && (
        <Something>
          {children.map((child) => (
            <Node node={child} key={child.text} />
          ))}
        </Something>
      )}
    </Flex>
  )
}

function Relation() {
  const [dim, setDim] = useState({
    x1: 18 - 8,
    y1: 39.5 - 8,
    x2: 65.375 - 8,
    y2: 19 - 8,
  })
  const { x1, y1, x2, y2 } = dim
  const measuredRef = useCallback(logBoundingClientRect)

  return (
    <AbsSvg ref={measuredRef}>
      <Line {...dim} />
    </AbsSvg>
  )

  function adjustDim(node) {
    if (node) {
      const { x, y } = node.getBoundingClientRect()
      setDim({
        x1: 18 - x,
        y1: 39.5 - y,
        x2: 65.375 - x,
        y2: 19 - y,
      })
    }
  }
}

function logBoundingClientRect(node) {
  if (node) console.log(node.getBoundingClientRect())
}

const Line = styled.line`
  pointer-events: auto;
  stroke: red;
  stroke-width: 5;
`

const AbsSvg = styled.svg`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Something = styled.div`
  display: flex;
  flex-direction: column;

  left: 50px;
  border: 1px dashed black;
`

const HeightDefined = styled.button`
  height: min-content;
  width: max-content;
  border: 2px solid black;
  margin: 10px;
`

export default { title: 'proofs of concept' }
export { LinesBetweenDivsInstance }
