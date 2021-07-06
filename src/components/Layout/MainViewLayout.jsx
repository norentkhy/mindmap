import React from 'react'
import styled from 'styled-components'

export default function MainViewLayout({
  MindLinks,
  MindNodes,
  eventListeners,
}) {
  return (
    <MindSpace aria-label="main view" {...eventListeners}>
      <LinkLayer>{MindLinks}</LinkLayer>
      <NodeLayer>{MindNodes}</NodeLayer>
    </MindSpace>
  )
}

const MindSpace = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const LinkLayer = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

const NodeLayer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`
