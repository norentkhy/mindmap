import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import useResizeObserver from '@react-hook/resize-observer'

/**
 * conclusions
 *
 * to calculate mouse offset:
 * - use clientX clientY for mouse coordinates
 * - use target.boundingClientRect
 */

function Clicks() {
  return <ClickSurface />
}

function ClickSurface() {
  const ref = useRef()
  useResizeObserver(ref, getTargetBCR)

  return (
    <Surface ref={ref} onClick={(event) => console.log(event.nativeEvent)} />
  )
}

function getTargetBCR(event) {
  console.log(event.target.getBoundingClientRect())
}

const Surface = styled.div`
  width: 95vw;
  height: 150vh;
  background-color: yellowgreen;
`
export default { title: 'proofs of concept' }
export { Clicks }
