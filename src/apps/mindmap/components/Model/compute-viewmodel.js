import {
  Collection,
  IdsOf,
  NodeContents,
  Ids,
  Nodes,
} from '~mindmap/data-structures'

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
  startToEditNode,
  applyNodeEdit,
  toggleFoldOnNode,
  createChildNode,
  useSizeObserver,
}) {
  const visibleIds = getVisibleNodes(nodes)
  return visibleIds.map((id) =>
    packageNode({
      id,
      nodes,
      useSizeObserver,
      startToEditNode,
      applyNodeEdit,
      toggleFoldOnNode,
      createChildNode,
    })
  )

  function packageNode({
    id,
    nodes,
    useSizeObserver,
    startToEditNode,
    applyNodeEdit,
    toggleFoldOnNode,
    createChildNode,
  }) {
    const { space, contents, editingIds, foldedIds, focusedId } = nodes
    const { centerOffset } = Collection.get(space, id)
    const content = NodeContents.get(contents, id)

    return {
      id,
      ...content,
      editing: Ids.has(editingIds, id),
      folded: Ids.has(foldedIds, id),
      focused: id === focusedId,
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

function getVisibleNodes(nodes) {
  const { ids, foldedIds, childIdsOf } = nodes
  const hiddenIds = Array.from(foldedIds).flatMap((foldedId) =>
    getRecursivelyConnectedIds(foldedId, childIdsOf)
  )
  return Ids.filter(ids, (id) => !hiddenIds.includes(id))
}

function getRecursivelyConnectedIds(id, idsConnectedTo) {
  const connectedIds = Array.from(IdsOf.get(idsConnectedTo, id))
  if (!connectedIds.length) return []

  const connectedChildIds = connectedIds.flatMap((childId) =>
    getRecursivelyConnectedIds(childId, idsConnectedTo)
  )

  return [...connectedIds, ...connectedChildIds]
}
