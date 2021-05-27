import { Collection, Children } from '~mindmap/data-structures'

export default function computeViewmodel(state, actions, hooks) {
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
      space: state.space,
      arrows: state.arrows,
      editingNodeIds: state.user.editingNodes,
      foldedNodeIds: state.user.foldedNodes,
      focusedNodeId: state.user.focusedNode,
      startToEditNode: actions.initiateEditNode,
      applyNodeEdit: actions.finalizeEditNode,
      toggleFoldOnNode: actions.foldNode,
      createChildNode: actions.createChildNode,
      useSizeObserver: hooks.useSizeObserver,
    }),
    do: {
      createTab: actions.addNewTab,
      createNode: actions.createRootNode,
      createNodeOnMouse: computeCreateNodeOnMouse(actions.createRootNode),
    },
  }
}

function computeCreateNodeOnMouse(createRootNode) {
  return createNodeOnMouse

  function createNodeOnMouse(event) {
    const centerOffset = computeCenterOffset(event)
    createRootNode(centerOffset)
  }
}

function computeCenterOffset({ clientX, clientY, target }) {
  const { left, top } = target.getBoundingClientRect()
  return {
    left: clientX - left,
    top: clientY - top,
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
  space,
  arrows,
  editingNodeIds,
  foldedNodeIds,
  focusedNodeId,
  startToEditNode,
  applyNodeEdit,
  toggleFoldOnNode,
  createChildNode,
  useSizeObserver,
}) {
  const visibleNodes = getVisibleNodes(nodes, arrows, foldedNodeIds)
  return visibleNodes.map(([id, node]) =>
    packageNode({
      id,
      node,
      space,
      editingNodeIds,
      foldedNodeIds,
      focusedNodeId,
      useSizeObserver,
      startToEditNode,
      applyNodeEdit,
      toggleFoldOnNode,
      createChildNode,
    })
  )

  function packageNode({
    id,
    node,
    space,
    editingNodeIds,
    foldedNodeIds,
    focusedNodeId,
    useSizeObserver,
    startToEditNode,
    applyNodeEdit,
    toggleFoldOnNode,
    createChildNode,
  }) {
    const { centerOffset } = Collection.get(space, id)

    return {
      ...node,
      id,
      editing: editingNodeIds.includes(id),
      folded: foldedNodeIds.includes(id),
      focused: id === focusedNodeId,
      compute: {
        containerStyle: ({ width, height }) => ({
          position: 'absolute',
          left: `${centerOffset.left - width / 2}px`,
          top: `${centerOffset.top - height / 2}px`,
        }),
      },
      use: {
        sizeObserver: useSizeObserver,
      },
      do: {
        startToEdit: () => startToEditNode({ id }),
        changeNodeText: (text) => applyNodeEdit({ id, text }),
        toggleFold: () => toggleFoldOnNode({ id }),
        createChild: () => createChildNode({ parentId: id }),
      },
    }
  }
}

function getVisibleNodes(nodes, arrows, foldedNodeIds) {
  const hiddenNodeIds = foldedNodeIds.flatMap((id) =>
    getConnectedNodes(id, arrows)
  )
  return Collection.filter(nodes, ([id]) => !hiddenNodeIds.includes(id))
}

function getConnectedNodes(id, arrows) {
  const connectedIds = Children.get(arrows, id)
  if (!connectedIds.length) return []

  const connectedChildIds = connectedIds.flatMap((childId) =>
    getConnectedNodes(childId, arrows)
  )

  return [...connectedIds, ...connectedChildIds]
}
