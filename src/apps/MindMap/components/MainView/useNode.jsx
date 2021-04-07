import { useContext, useRef } from 'react'

export default function useNode({ node, theProjectContext }) {
  const { editing, id, text } = node

  const {
    createChildNode,
    foldNode,
    initiateEditNode,
    useThisResizeObserver,
    registerNodeLayout,
  } = useContext(theProjectContext)

  const nodeRef = useRef()

  useThisResizeObserver(nodeRef, registerThisNodeLayout)

  return {
    editing,
    id,
    text,
    createChildNode,
    foldNode,
    initiateEditNode,
    nodeRef,
  }

  function registerThisNodeLayout(event) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = event.target
    registerNodeLayout({
      id,
      boundingClientRect: event.target.getBoundingClientRect(),
      offsetRect: { offsetLeft, offsetTop, offsetWidth, offsetHeight },
    })
  }
}
