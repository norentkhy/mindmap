import React, { useContext, useRef } from 'react'
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
          nodeId={node.id}
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
      offsetRect: { offsetLeft, offsetTop, offsetWidth, offsetHeight },
    })
  }
}

function RootContainer({ theProjectContext, children, nodeId }) {
  const ref = useRef()
  const { registerTreeLayout, useThisResizeObserver } = useContext(
    theProjectContext
  )
  useThisResizeObserver(ref, registerThisTreeLayout)

  return (
    <div ref={ref} aria-label="container of rootnode">
      {children}
    </div>
  )

  function registerThisTreeLayout(event) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = event.target
    registerTreeLayout({
      id: nodeId,
      boundingClientRect: event.target.getBoundingClientRect(),
      offsetRect: { offsetLeft, offsetTop, offsetWidth, offsetHeight },
    })
  }
}
