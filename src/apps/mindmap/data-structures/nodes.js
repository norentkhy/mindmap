import { Space, IdsOf, NodeContents } from './node-features'
import { Ids } from './primitives'
import { update } from '~/utils/FunctionalProgramming'

export default {
  init,
  getArrayVisibleIds,
  getArrayChildLinksOf,
  getCenterOffset,
  getText,
  isEditing,
  isFolded,
  isFocused,
  createRoot,
  createChild,
  editContents,
  select,
  toggleFold,
  shiftFocusTo,
  initiateMove,
  finalizeMove,
  getSize,
  registerSize,
  makeParent,
}

function init() {
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

function isEditing(nodes, id) {
  return Ids.has(nodes.editingIds, id)
}

function isFolded(nodes, id) {
  return Ids.has(nodes.foldedIds, id)
}

function isFocused(nodes, id) {
  return nodes.focusedId === id
}

function getText(nodes, id) {
  return NodeContents.getText(nodes.contents, id)
}

function getCenterOffset(nodes, id) {
  return Space.get(nodes.space, id).centerOffset
}

function getArrayVisibleIds(nodes) {
  const hiddenIds = Array.from(nodes.foldedIds).flatMap((foldedId) =>
    IdsOf.getRecursive(nodes.childIdsOf, foldedId)
  )
  return Ids.filter(nodes.ids, (id) => !hiddenIds.includes(id))
}

function getArrayChildLinksOf(nodes, parentId) {
  const childIds = IdsOf.get(nodes.childIdsOf, parentId)
  return Ids.toArray.map(childIds, (childId) => ({ parentId, childId }))
}

function createRoot(nodes, centerOffset) {
  const [unassignedNodeUpdate, id] = createUnassignedNode(nodes)
  return update(nodes, {
    ...unassignedNodeUpdate,
    space: Space.registerRoot(nodes.space, id, centerOffset),
  })
}

function createChild(nodes, parentId) {
  const [unassignedNodeUpdate, childId] = createUnassignedNode(nodes)
  const siblingIds = IdsOf.get(nodes.childIdsOf, parentId)

  return update(nodes, {
    ...unassignedNodeUpdate,
    space: Space.registerChild(nodes.space, { childId, parentId, siblingIds }),
    childIdsOf: IdsOf.add(nodes.childIdsOf, parentId, childId),
  })
}

function editContents(nodes, id, newContent) {
  return update(nodes, {
    contents: NodeContents.set(nodes.contents, id, newContent),
    editingIds: Ids.flip(nodes.editingIds, id),
    focusedId: id,
  })
}

function select(nodes, id) {
  return update(nodes, { focusedId: id })
}

function toggleFold(nodes, id) {
  return update(nodes, {
    foldedIds: Ids.flip(nodes.foldedIds, id),
    focusedId: id,
  })
}

function createUnassignedNode(nodes) {
  const [newIds, id] = Ids.getNew(nodes.ids)
  const unassignedNodeUpdate = {
    ids: newIds,
    contents: NodeContents.setText(nodes.contents, id, ''),
    editingIds: Ids.add(nodes.editingIds, id),
    focusedId: id,
  }

  return [unassignedNodeUpdate, id]
}

function shiftFocusTo(nodes, direction) {
  return update(nodes, {
    focusedId: Space.getClosest(nodes.space, nodes.focusedId, direction),
  })
}

function initiateMove(nodes, id, offset) {
  return update(nodes, {
    space: Space.registerMoveStart(nodes.space, id, offset),
  })
}

function finalizeMove(nodes, id, offset) {
  return update(nodes, {
    space: Space.registerMoveEnd(nodes.space, id, offset),
  })
}

function getSize(nodes, id) {
  return Space.getSize(nodes.space, id)
}

function registerSize(nodes, id, size) {
  return update(nodes, {
    space: Space.registerSize(nodes.space, id, size),
  })
}

function makeParent(nodes, parentId, childId) {
  return update(nodes, {
    childIdsOf: IdsOf.add(nodes.childIdsOf, parentId, childId),
  })
}
