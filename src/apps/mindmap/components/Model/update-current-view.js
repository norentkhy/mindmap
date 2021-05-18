import produce from 'immer'
import Collection from '../../data-structures/collection'

export default function updateCurrentView(state, actions) {
  return produce(state, (newState) => {
    if (!newState.currentView) newState.currentView = {}

    newState.currentView.nodesToRender = computeNodesToRender({
      nodes: state.nodes,
      arrows: state.arrows,
      foldedNodeIds: state.user.foldedNodes,
      startToEditNode: actions.initiateEditNode,
      applyNodeEdit: actions.finalizeEditNode,
      toggleFoldOnNode: actions.foldNode,
      createChildNode: actions.createChildNode,
    })
  })
}

function computeNodesToRender({
  nodes,
  arrows,
  foldedNodeIds,
  startToEditNode,
  applyNodeEdit,
  toggleFoldOnNode,
  createChildNode,
}) {
  const hiddenNodeIds = foldedNodeIds.flatMap((id) =>
    getConnectedNodes(id, arrows)
  )
  const visibleNodes = Collection.filter(
    nodes,
    ([id]) => !hiddenNodeIds.includes(id)
  )

  visibleNodes.map(([id, node]) => {
    return {
      ...node,
      id,
      startToEditThisNode: () => startToEditNode({collectionId: id}),
      changeNodeText: (text) => applyNodeEdit({collectionId: id, text }),
      toggleFoldOnThisNode: () => toggleFoldOnNode({collectionId: id}),
      createChildOfThisNode: () => createChildNode({collectionId: id}),
    }
  })
}

function getConnectedNodes(id, arrows) {
  const connectedId = Collection.get(arrows, id)
  if (!connectedId) return []

  return [connectedId, getConnectedNodes(connectedId, arrows)]
}
