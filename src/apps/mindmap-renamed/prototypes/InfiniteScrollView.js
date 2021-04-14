import React, { useRef, useState } from 'react'
import styled from 'styled-components'

function InfiniteScrollViewInstance() {
  return (
    <FullView>
      Open canvas in new tab, because scrolling might cause going back in page
      <InfiniteScrollView>
        <div style={{ width: 999, height: 999, backgroundColor: '#aaa' }}>
          {`<-- scroll horizontally and/or vertically, the background shows when view is extended`}
        </div>
      </InfiniteScrollView>
    </FullView>
  )
}

const FullView = styled.div`
  width: 96vw;
  height: 96vh;
`

const initialGrowth = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
}

function InfiniteScrollView({ children, className }) {
  const [growth, setGrowth] = useState(initialGrowth)
  const ref = useRef()
  const { width, height } = calculateDivSize()

  return (
    <ScrollOverflow ref={ref} className={className} onWheel={determineGrowth}>
      <Content growth={growth}>{children}</Content>
      <FillingBackground width={width} height={height} />
    </ScrollOverflow>
  )

  function calculateDivSize() {
    if (ref.current) {
      return sumScrollAndGrowthSizes()
    }

    return {
      width: 0,
      height: 0,
    }

    function sumScrollAndGrowthSizes() {
      const { scrollWidth, scrollHeight } = ref.current
      const { left, right, top, bottom } = growth

      return {
        width: scrollWidth + left + right,
        height: scrollHeight + top + bottom,
      }
    }
  }

  function determineGrowth(event) {
    const delta = calculateGrowthDelta()

    setGrowth(({ left, top, right, bottom }) => ({
      left: left + delta.left,
      top: top + delta.top,
      right: right + delta.right,
      bottom: bottom + delta.bottom,
    }))

    function calculateGrowthDelta() {
      const { deltaX, deltaY } = event
      const { scrollLeft, offsetWidth, scrollWidth } = ref.current
      const { scrollTop, offsetHeight, scrollHeight } = ref.current

      const isAtBoundary = {
        left: scrollLeft <= 0,
        top: scrollTop <= 0,
        right: offsetWidth + scrollLeft >= scrollWidth,
        bottom: offsetHeight + scrollTop >= scrollHeight,
      }

      const shouldGrow = {
        left: isAtBoundary.left && deltaX < 0,
        top: isAtBoundary.top && deltaY < 0,
        right: isAtBoundary.right && deltaX > 0,
        bottom: isAtBoundary.bottom && deltaY > 0,
      }

      return {
        left: shouldGrow.left ? -deltaX : 0,
        top: shouldGrow.top ? -deltaY : 0,
        right: shouldGrow.right ? deltaX : 0,
        bottom: shouldGrow.bottom ? deltaY : 0,
      }
    }
  }
}

const Content = styled.div.attrs(({ growth: { left, top } }) => ({
  style: { left, top },
}))`
  position: absolute;
`

const FillingBackground = styled.div.attrs(({ width, height }) => ({
  style: { width, height },
}))`
  position: absolute;
  inset: 0;
  background-color: #00967d;
  z-index: -1;
`

const ScrollOverflow = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-color: #ddd;

  z-index: 1;
`

export default { title: 'proofs of concept' }
export { InfiniteScrollViewInstance }
