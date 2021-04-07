import React, { useContext, useRef } from 'react'
import styled from 'styled-components'
import { ProjectContext } from '../Contexts/ProjectContext'
import determineNodesToRender from './determineNodesToRender'
import NodeFamily from './NodeFamily'

export function MainView({ theProjectContext = ProjectContext }) {
  const { createRootNode, nodesToRender, surfaceRef } = useMainView(
    theProjectContext
  )

  return (
    <div ref={surfaceRef} aria-label="main view" onDoubleClick={createRootNode}>
      {nodesToRender?.map((node) => (
        <RootContainer
          node={node}
          key={`container ${node.id}`}
          theProjectContext={theProjectContext}
        >
          <NodeFamily
            headNode={node}
            key={node.id}
            theProjectContext={theProjectContext}
          />
        </RootContainer>
      ))}
    </div>
  )
}

function useMainView(theProjectContext) {
  const {
    state,
    createRootNode,
    registerSurfaceLayout,
    useThisResizeObserver,
  } = useContext(theProjectContext)
  const nodesToRender = determineNodesToRender(state)
  const surfaceRef = useRef()
  useThisResizeObserver(surfaceRef, handleResizeEvent)

  return { surfaceRef, createRootNode, nodesToRender }

  function handleResizeEvent(event) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = event.target
    registerSurfaceLayout({
      boundingClientRect: event.target.getBoundingClientRect(),
      offsetRect: {
        left: offsetLeft,
        top: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
      },
    })
  }
}

function RootContainer({ theProjectContext, children, node }) {
  const ref = useRef()
  const { registerTreeLayout, useThisResizeObserver } = useContext(
    theProjectContext
  )
  useThisResizeObserver(ref, registerThisTreeLayout)

  return (
    <AbsolutelyPositionedContainer
      left={node.desiredTreeCss?.offsetLeft}
      top={node.desiredTreeCss?.offsetTop}
      ref={ref}
      aria-label="container of rootnode"
    >
      {children}
    </AbsolutelyPositionedContainer>
  )

  function registerThisTreeLayout(event) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = event.target
    registerTreeLayout({
      id: node.id,
      boundingClientRect: event.target.getBoundingClientRect(),
      offsetRect: {
        left: offsetLeft,
        top: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
      },
    })
  }
}

const AbsolutelyPositionedContainer = styled.div`
  position: absolute;
  left: ${({ left }) => (left ? `${left}px` : 'auto')};
  top: ${({ top }) => (top ? `${top}px` : 'auto')};
`
