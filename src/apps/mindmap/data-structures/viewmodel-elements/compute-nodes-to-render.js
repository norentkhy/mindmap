import { Nodes } from '~mindmap/data-structures'
import { computeCenterOffset } from './mouse-computations'

export default function computeNodesToRender({
  nodes,
  actions,
  useSizeObserver,
}) {
  const bindIdToNodeActions = prepareNodeIdBindings(actions)
  const visibleIds = Nodes.getArrayVisibleIds(nodes)

  return visibleIds.map((id) =>
    packageNode({ id, nodes, useSizeObserver, bindIdToNodeActions })
  )
}

function prepareNodeIdBindings({
  initiateEditNode,
  finalizeEditNode,
  foldNode,
  createChildNode,
  selectNode,
  initiateMoveNode,
  finalizeMoveNode,
}) {
  return (id) => ({
    startToEdit: () => initiateEditNode(id),
    changeNodeText: (text) => finalizeEditNode({ id, text }),
    toggleFold: () => foldNode({ id }),
    createChild: () => createChildNode(id),
    select: () => selectNode(id),
    handleDragStart: (e) => initiateMoveNode(id, computeCenterOffset(e)),
    handleDragEnd: (e) => finalizeMoveNode(id, computeCenterOffset(e)),
  })
}

function packageNode({ id, nodes, useSizeObserver, bindIdToNodeActions }) {
  const nodeProperties = getNodeProperties(nodes, id)
  const nodeComputations = bindNodeComputations(nodes, id)

  return {
    ...nodeProperties,
    compute: nodeComputations,
    use: { sizeObserver: useSizeObserver },
    do: bindIdToNodeActions(id),
  }
}

function getNodeProperties(nodes, id) {
  return {
    id,
    text: Nodes.getText(nodes, id),
    editing: Nodes.isEditing(nodes, id),
    folded: Nodes.isFolded(nodes, id),
    focused: Nodes.isFocused(nodes, id),
  }
}

function bindNodeComputations(nodes, id) {
  const centerOffset = Nodes.getCenterOffset(nodes, id)

  return {
    containerStyle: ({ width, height }) => ({
      position: 'absolute',
      left: `${centerOffset.left - width / 2}px`,
      top: `${centerOffset.top - height / 2}px`,
    }),
  }
}
