export default function determineNodesToRender(stateOrNode, model) {
  const shouldRender = !stateOrNode?.folded
  const candidateNodes = stateOrNode?.children || stateOrNode?.trees
  const nodes = (shouldRender && candidateNodes) || []

  // return node
  return nodes.map((node) => packageNode(node, model))
}

function packageNode(node, model) {
  const { id } = node
  const { createChildNode, initiateEditNode, finalizeEditNode, foldNode } =
    model

  return {
    ...node,
    startToEditThisNode: () => initiateEditNode({ id }),
    changeNodeText: (text) => finalizeEditNode({ id, text }),
    toggleFoldOnThisNode: () => foldNode({ id }),
    createChildOfThisNode: () => createChildNode({ parentId: id }),
  }
}
