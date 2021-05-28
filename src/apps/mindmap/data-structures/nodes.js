import { Space, IdsOf, NodeContents, Ids } from '~mindmap/data-structures'
import { update } from '~/utils/FunctionalProgramming'

export default {
  init: initialiseNodes,
  getArrayOf: getArrayOfKeys,
  createRoot: createRootNode,
  createChild: createChildNode,
  editContents: editNodeContents,
  toggleFold: toggleNodeFold,
}

function initialiseNodes() {
  return {
    ids: Ids.init(),
    contents: NodeContents.create(),
    space: Space.create(),
    childIdsOf: IdsOf.init(),
    editingIds: Ids.init(),
    foldedIds: Ids.init(),
    focusedId: null,
  }
}

function getArrayOfKeys(nodes, keyOrKeys) {
  if (!Array.isArray(keyOrKeys)) {
    const key = keyOrKeys
    return getArrayOfKey(nodes, key)
  }

  const keys = keyOrKeys
  return keys.map((key) => getArrayOfKey(nodes, key))
}

function getArrayOfKey(nodes, key) {
  return Array.from(nodes[key])
}

function createRootNode(nodes, centerOffset) {
  const { space } = nodes
  const [unassignedNodeUpdate, id] = createUnassignedNode(nodes)

  return update(nodes, {
    ...unassignedNodeUpdate,
    space: Space.registerRoot(space, id, centerOffset),
  })
}

function createChildNode(nodes, parentId) {
  const { childIdsOf, space } = nodes
  const [unassignedNodeUpdate, childId] = createUnassignedNode(nodes)
  const siblingIds = IdsOf.get(childIdsOf, parentId)

  return update(nodes, {
    ...unassignedNodeUpdate,
    space: Space.registerChild(space, { childId, parentId, siblingIds }),
    childIdsOf: IdsOf.add(childIdsOf, parentId, childId),
  })
}

function editNodeContents(nodes, id, newContent) {
  const { contents, editingIds } = nodes

  return update(nodes, {
    contents: NodeContents.set(contents, id, newContent),
    editingIds: Ids.flip(editingIds, id),
    focusedId: id,
  })
}

function toggleNodeFold(nodes, id) {
  const { foldedIds } = nodes

  return update(nodes, {
    foldedIds: Ids.flip(foldedIds, id),
    focusedId: id,
  })
}

function createUnassignedNode(nodes) {
  const { ids, contents, editingIds } = nodes
  const [newIds, id] = Ids.getNew(ids)

  const unassignedNodeUpdate = {
    ids: newIds,
    contents: NodeContents.set(contents, id, { text: '' }),
    editingIds: Ids.add(editingIds, id),
    focusedId: id,
  }

  return [unassignedNodeUpdate, id]
}
