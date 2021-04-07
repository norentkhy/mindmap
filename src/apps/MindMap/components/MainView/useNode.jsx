import { useContext, useRef } from 'react'

export default function useNode({ node, theProjectContext }) {
  const { editing, id, text } = node

  const {
    createChildNode,
    foldNode,
    initiateEditNode,
    useThisResizeObserver,
    updateNodeDimensions,
  } = useContext(theProjectContext)

  const nodeRef = useRef()

  useThisResizeObserver(nodeRef, updateTheseNodeDimensions)

  return {
    editing,
    id,
    text,
    createChildNode,
    foldNode,
    initiateEditNode,
    nodeRef,
  }

  function updateTheseNodeDimensions(event) {
    updateNodeDimensions({
      id,
      dimensions: event.target.getBoundingClientRect(),
    })
  }
}
