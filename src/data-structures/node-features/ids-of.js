import { Collection, Ids } from '../primitives'

export default {
  init: Collection.create,
  get: getIdsOf,
  getRecursive: getRecursiveIdsOf,
  add: addIdto,
}

function getIdsOf(idsOf, targetId) {
  const childIds = Collection.get(idsOf, targetId)
  if (!childIds) return Ids.init()
  return childIds
}

function addIdto(idsOf, targetId, id) {
  const ids = getIdsOf(idsOf, targetId)
  const newIds = Ids.add(ids, id)
  return Collection.replace(idsOf, targetId, newIds)
}

function getRecursiveIdsOf(idsConnectedTo, id) {
  const connectedIds = Array.from(getIdsOf(idsConnectedTo, id))
  if (!connectedIds.length) return []

  const connectedChildIds = connectedIds.flatMap((childId) =>
    getRecursiveIdsOf(idsConnectedTo, childId)
  )

  return [...connectedIds, ...connectedChildIds]
}
