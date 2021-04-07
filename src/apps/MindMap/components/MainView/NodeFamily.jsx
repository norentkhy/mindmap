import React from 'react'
import styled from 'styled-components'
import determineNodesToRender from './determineNodesToRender'
import Node from './Node'

export default function NodeFamily({ headNode, theProjectContext }) {
  const nodesToRender = determineNodesToRender(headNode)

  return (
    <FlexRowCentered>
      <Node
        node={headNode}
        key={headNode.id}
        theProjectContext={theProjectContext}
      />
      <ChildContainer>
        {nodesToRender?.map((node) => (
          <NodeFamily
            headNode={node}
            key={node.id}
            theProjectContext={theProjectContext}
          />
        ))}
      </ChildContainer>
    </FlexRowCentered>
  )
}

const FlexRowCentered = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`
