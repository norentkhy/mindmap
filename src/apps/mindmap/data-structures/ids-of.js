import { Collection, Ids } from './index'

export default {
  init: Collection.create,
  get: getIdsOf,
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
