import Collection from '../../data-structures/collection'

export default function computeViewmodel(state, actions) {
  return {
    tabs: computeTabsToRender({
      tabs: state.tabs,
      selectedTab: state.user.selectedTab,
      renamingTab: state.user.renamingTab,
      selectTab: actions.selectTab,
      startToRenameTab: actions.initiateRenameTab,
      applyTabRename: actions.finishRenameTab,
    }),
    nodes: computeNodesToRender({
      nodes: state.nodes,
      arrows: state.arrows,
      editingNodeIds: state.user.editingNodes,
      foldedNodeIds: state.user.foldedNodes,
      focusedNodeId: state.user.focusedNode,
      startToEditNode: actions.initiateEditNode,
      applyNodeEdit: actions.finalizeEditNode,
      toggleFoldOnNode: actions.foldNode,
      createChildNode: actions.createChildNode,
    }),
    do: {
      createTab: actions.addNewTab,
    },
  }
}

function computeTabsToRender({
  tabs,
  selectedTab,
  renamingTab,
  selectTab,
  startToRenameTab,
  applyTabRename,
}) {
  return Collection.map(tabs, ([id, tab]) => ({
    ...tab,
    id,
    selected: id === selectedTab,
    renaming: id === renamingTab,
    do: {
      select: () => selectTab(id),
      editName: () => startToRenameTab(id),
      rename: (newName) => applyTabRename(id, newName),
    },
  }))
}

function computeNodesToRender({
  nodes,
  arrows,
  editingNodeIds,
  foldedNodeIds,
  focusedNodeId,
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

  return visibleNodes.map(([id, node]) => ({
    ...node,
    id,
    editing: editingNodeIds.includes(id),
    folded: foldedNodeIds.includes(id),
    focused: id === focusedNodeId,
    do: {
      startToEdit: () => startToEditNode({ id }),
      changeNodeText: (text) => applyNodeEdit({ id, text }),
      toggleFold: () => toggleFoldOnNode({ id }),
      createChild: () => createChildNode({ parentId: id }),
    },
  }))
}

function getConnectedNodes(id, arrows) {
  const connectedId = Collection.get(arrows, id)
  if (!connectedId) return []

  return [connectedId, ...getConnectedNodes(connectedId, arrows)]
}
