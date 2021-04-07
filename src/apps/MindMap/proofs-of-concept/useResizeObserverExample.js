import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import useResizeObserver from '@react-hook/resize-observer'

function UseResizeObserverInstance() {
  return (
    <div>
      <Resizeable>
        <div>see console log</div>
      </Resizeable>
    </div>
  )
}

function Resizeable({ children }) {
  const [size, setSize] = useState({ x: 400, y: 300 })
  const ref = useRef()
  useResizeObserver(ref, logSomething)

  // copy paste component, this is not high quality
  const handler = useCallback(() => {
    function onMouseMove(e) {
      setSize((currentSize) => ({
        x: currentSize.x + e.movementX,
        y: currentSize.y + e.movementY,
      }))
    }
    function onMouseUp() {
      ref.current.removeEventListener('mousemove', onMouseMove)
      ref.current.removeEventListener('mouseup', onMouseUp)
    }

    ref.current.addEventListener('mousemove', onMouseMove)
    ref.current.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <Div width={size.x} height={size.y}>
      <FillingButton ref={ref} onMouseDown={handler} />
    </Div>
  )
}

function logSomething(e) {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = e.target
  console.log({ offsetLeft, offsetTop, offsetWidth, offsetHeight })
}

const FillingButton = styled.button`
  width: 100%;
  height: 100%;
`

const Div = styled.div.attrs(updateWidthAndHeight)``

function updateWidthAndHeight({ width, height }) {
  return { style: { width: `${width}px`, height: `${height}px` } }
}

export default { title: 'proofs of concept' }
export { UseResizeObserverInstance }
