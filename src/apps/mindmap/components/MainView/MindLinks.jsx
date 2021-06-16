import React from 'react'
import styled from 'styled-components'

export default function MindLinks({ links }) {
  return (
    <LinkSpace aria-label="link space">
      {links?.map((link) => (
        <MindLink key={link.id} link={link} />
      ))}
    </LinkSpace>
  )
}

const LinkSpace = styled.svg`
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
`

function MindLink({ link }) {
  return (
    <g aria-label="child of parent">
      <LinkLine link={link} />
      <LinkAnchor anchor={link.start} />
      <LinkAnchor anchor={link.end} />
    </g>
  )
}

function LinkLine({ link }) {
  const { left: x1, top: y1 } = link.start.centerOffset
  const { left: x2, top: y2 } = link.end.centerOffset
  return (
    <line x1={x1} x2={x2} y1={y1} y2={y2} stroke="black" strokeWidth="2" />
  )
}

function LinkAnchor({ anchor }) {
  const { left, top } = anchor.centerOffset
  return (
    <circle
      aria-label="anchor of link"
      cx={left}
      cy={top}
      r="2"
      fill="solid"
    />
  )
}
