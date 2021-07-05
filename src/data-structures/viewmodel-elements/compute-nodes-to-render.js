import { Nodes } from 'src/data-structures'
import { computeCenterOffset } from './mouse-computations'

export default function computeNodesToRender({
  ids,
  nodes,
  actions,
  useSizeObserver,
}) {
  const bindIdToNodeActions = prepareNodeIdBindings(actions)

  return ids.map((id) =>
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
  registerNodeSize,
  makeParent,
}) {
  return (id) => ({
    startToEdit: () => initiateEditNode(id),
    changeNodeText: (text) => finalizeEditNode({ id, text }),
    toggleFold: () => foldNode({ id }),
    createChild: () => createChildNode(id),
    select: () => selectNode(id),
    handleDragStart: (e, NodeSpace) =>
      initiateMoveNode(id, computeCenterOffset(e, NodeSpace)),
    registerSize: (size) => registerNodeSize(id, size),
    makeParent: (targetId) => makeParent(id, targetId),
  })
}

function packageNode({ id, nodes, useSizeObserver, bindIdToNodeActions }) {
  const nodeProperties = getNodeProperties(nodes, id)

  return {
    ...nodeProperties,
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
    centerOffset: Nodes.getCenterOffset(nodes, id),
  }
}
