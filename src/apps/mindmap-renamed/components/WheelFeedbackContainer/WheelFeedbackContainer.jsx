import React, {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

export default function WheelFeedbackContainer({ children, className }) {
  const [wheelFeedback, setWheelFeedback] = useState({
    id: 0,
    atBoundary: { left: true, top: true, right: false, bottom: false },
  })
  const ref = useRef()

  const childrenWithScrollBoundaryFeedback = getChildrenWithWheelFeedback()

  return (
    <ScrollDiv
      ref={ref}
      aria-label="container for detection of scolling at boundary"
      className={className}
      onWheel={giveWheelFeedback}
    >
      {childrenWithScrollBoundaryFeedback}
    </ScrollDiv>
  )

  function giveWheelFeedback(event) {
    setWheelFeedback({
      id: wheelFeedback.id + 1,
      atBoundary: isAtBoundary(ref.current),
      amount: calculateWheelAmount(event),
    })

    function isAtBoundary({
      scrollLeft,
      offsetWidth,
      scrollWidth,
      scrollTop,
      offsetHeight,
      scrollHeight,
    }) {
      return {
        left: scrollLeft <= 0,
        top: scrollTop <= 0,
        right: offsetWidth + scrollLeft >= scrollWidth,
        bottom: offsetHeight + scrollTop >= scrollHeight,
      }
    }

    function calculateWheelAmount({ deltaX, deltaY }) {
      return {
        left: deltaX < 0 ? -deltaX : 0,
        top: deltaY < 0 ? -deltaY : 0,
        right: deltaX > 0 ? deltaX : 0,
        bottom: deltaY > 0 ? deltaY : 0,
      }
    }
  }

  function getChildrenWithWheelFeedback() {
    return Children.map(children, (child) => {
      if (isValidElement(child)) return cloneElement(child, { wheelFeedback })
      return child
    })
  }
}
const ScrollDiv = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-color: #ddd;

  z-index: 1;
`
