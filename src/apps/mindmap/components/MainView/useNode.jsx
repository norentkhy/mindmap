import { useRef } from 'react'

export default function useNode({ node, useThisModel }) {
  const { editing, id, text } = node

  const { createChildNode, foldNode, initiateEditNode } = useThisModel()

  const nodeRef = useRef()

  return {
    editing,
    id,
    text,
    createChildNode,
    foldNode,
    initiateEditNode,
    nodeRef,
  }
}
