import Collection from './collection'

export default {
  create: Collection.create,
  get: Collection.get,
  registerRoot: registerRootSpace,
  registerChild: registerChildSpace,
}

const stepSize = {
  horizontal: 100,
  vertical: 50,
}

const firstCenterOffset = {
  left: 100,
  top: 50,
}

function getCenterOffset(space, id) {
  const { centerOffset } = Collection.get(space, id)
  return centerOffset
}

function registerRootSpace(space, id, centerOffset) {
  if (!centerOffset) centerOffset = getFreeIndependentCenterOffset(space)
  return Collection.replace(space, id, { centerOffset })
}

function registerChildSpace(space, { parentId, childId, siblingIds }) {
  const centerOffset = getFreeDescendantCenterOffset(space, {
    parentId,
    siblingIds,
  })
  return Collection.replace(space, childId, { centerOffset })
}

function getFreeIndependentCenterOffset(space) {
  //in future: make use of number of root nodes?
  return computeNextCenterOffset(firstCenterOffset, { downward: space.size })
}

function getFreeDescendantCenterOffset(space, { parentId, siblingIds }) {
  if (!siblingIds.length) {
    const { centerOffset: parentOffset } = Collection.get(space, parentId)
    return computeNextCenterOffset(parentOffset, { rightward: 1 })
  }

  const lastSiblingCenterOffset = siblingIds
    .map((id) => getCenterOffset(space, id))
    .reduce(getLaterOffset)

  return computeNextCenterOffset(lastSiblingCenterOffset, { downward: 1 })
}

function getLaterOffset(centerOffset0, centerOffset1) {
  if (centerOffset0.top > centerOffset1.top) return centerOffset0
  return centerOffset1
}

function computeNextCenterOffset(
  base,
  { leftward, upward, rightward, downward }
) {
  const draft = { ...base }

  if (leftward) draft.left -= leftward * stepSize.horizontal
  if (rightward) draft.left += rightward * stepSize.horizontal
  if (upward) draft.top -= upward * stepSize.vertical
  if (downward) draft.top += downward * stepSize.vertical

  return draft
}
