import produce from 'immer'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

/****CONCLUSIONS
  
  1. the drag and drop api work perfectly fine for manually node placement
  2. in order to TDD, drag and drop api will have to be mocked

  2. relative position adjustment does not care about absolute or relative pos
  3. although relative pos is used here, absolute pos will probably be better
  4. tree collision detection has to be made 
     (drop elements in overlapping manner to see why)
  5. note that subsequent action should probably queue tree collision detection

  5. drag and drop api will probably work for tree adjustments

*/

const tree1 = {
  text: 'numero uno',
  initialCss: { left: 0, top: 0 },
  subtrees: [
    {
      text: 'uno child uno',
      initialCss: { left: 0, top: 0 },
    },
    {
      text: 'uno child dos',
      initialCss: { left: 0, top: 0 },
    },
    {
      text: 'uno child tres',
      initialCss: { left: 0, top: 0 },
    },
  ],
}

const tree2 = {
  text: 'numero dos',
  initialCss: { left: 0, top: 0 },
}

const tree3 = {
  text: 'numero tres',
  initialCss: { left: 0, top: 0 },
}

function PlacementOfTreesInstance() {
  return (
    <TreeCanvas>
      <Tree tree={tree1} />
      <Tree tree={tree2} />
      <Tree tree={tree3} />
    </TreeCanvas>
  )
}

function Tree({
  tree: { text = 'tree', subtrees, initialCss } = { text: 'tree' },
}) {
  const ref = useRef()
  const [state, setState] = useState({
    css: { ...initialCss, position: 'relative' },
    dragStart: {},
  })
  const { css } = state

  useEffect(() => {
    if (ref.current && state.css.position === 'relative')
      convertToAbsolutePositioning(ref.current)
  }, [ref.current])

  return (
    <FlexRow
      ref={ref}
      draggable
      onDragStart={startNodeDrag}
      onDragEnd={endNodeDrag}
      stateCss={css}
      onDragEnter={() => console.log(text)}
    >
      <FlexColumnCentered>
        <Node>{text}</Node>
      </FlexColumnCentered>
      <FlexColumnCentered>
        {subtrees?.map((subtree) => (
          <Tree tree={subtree} key={subtree.text} />
        ))}
      </FlexColumnCentered>
    </FlexRow>
  )

  function convertToAbsolutePositioning({ offsetLeft, offsetTop }) {
    if (state.css.position === 'relative') {
      setState({
        ...state,
        css: { position: 'absolute', left: offsetLeft, top: offsetTop },
      })
    }
  }

  function startNodeDrag(event) {
    const { screenX, screenY, dataTransfer } = event
    event.stopPropagation()
    setNormalDragCursor(dataTransfer)
    setState((state) => ({ ...state, dragStart: { screenX, screenY } }))

    function setNormalDragCursor(dataTransfer) {
      dataTransfer.effectAllowed = 'move'
    }
  }

  function endNodeDrag(event) {
    const { screenX, screenY } = event
    event.stopPropagation()
    setState(
      produce(state, (newState) => {
        const { left, top } = state.css
        newState.css.left = left + screenX - state.dragStart.screenX
        newState.css.top = top + screenY - state.dragStart.screenY
        newState.dragStart = {}
      })
    )
  }
}

const Node = styled.button`
  margin: 5px;
  max-width: 400px;
`

const FlexColumnCentered = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;

  position: relative;
  border: 1px dashed black;
`

const FlexRow = styled.div`
  ${({ stateCss }) => `
    position: ${stateCss.position};
    left: ${stateCss.left}px;
    top: ${stateCss.top}px;
  `}

  display: inline-flex;
  flex-direction: row;
  width: fit-content;

  border: 1px dashed red;
`

function TreeCanvas({ children }) {
  return (
    <RelativeContainer onDragOver={preventDragEndAnimation}>
      {children}
    </RelativeContainer>
  )

  function preventDragEndAnimation(e) {
    e.preventDefault() //onDragOver
  }
}

const RelativeContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 95vw;
  height: 95vh;

  border: 3px solid black;
`

export default { title: 'proofs of concept' }
export { PlacementOfTreesInstance }
