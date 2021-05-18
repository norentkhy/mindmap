import React from 'react'
import useModel from '~mindmap/hooks/useModel'
import determineNodesToRender from './determineNodesToRender'
import NodeFamily from './NodeFamily'
import { MindSpace } from '../Styled'

export function MainView({ useThisModel = useModel }) {
  const { createRootNode, nodesToRender, surfaceRef } =
    useMainView(useThisModel)

  return (
    <MindSpace
      ref={surfaceRef}
      aria-label="main view"
      onDoubleClick={createRootNode}
    >
      {nodesToRender?.map((node) => (
        <RootContainer key={`container ${node.id}`}>
          <NodeFamily
            headNode={node}
            key={node.id}
            useThisModel={useThisModel}
          />
        </RootContainer>
      ))}
    </MindSpace>
  )
}

function useMainView(useThisModel) {
  const model = useThisModel()
  const { state, createRootNode } = model
  const nodesToRender = determineNodesToRender(state, model)

  return { createRootNode, nodesToRender }
}

function RootContainer({ children }) {
  return <div aria-label="container of rootnode">{children}</div>
}
