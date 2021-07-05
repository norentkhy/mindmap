import { v4 as createId } from 'uuid'

export default {
  init: createIds,
  has: hasId,
  add: addId,
  remove: removeId,
  flip: flipId,
  getNew: getNewId,
  filter: filterToArray,
  toArray: {
    map: mapToArray,
    filter: filterToArray,
  },
  isEmpty,
}

function createIds(...args) {
  return new Set(...args)
}

function hasId(ids, id) {
  return ids.has(id)
}

function addId(ids, id) {
  const newIds = createIds(ids)
  newIds.add(id)
  return newIds
}

function removeId(ids, id) {
  const newIds = createIds(ids)
  newIds.delete(id)
  return newIds
}

function flipId(ids, id) {
  return hasId(ids, id) ? removeId(ids, id) : addId(ids, id)
}

function getNewId(ids) {
  const newId = createId()
  const newIds = addId(ids, newId)
  return [newIds, newId]
}

function mapToArray(ids, applyMapping) {
  return Array.from(ids).map(applyMapping)
}

function filterToArray(ids, predicate) {
  return Array.from(ids).filter(predicate)
}

function isEmpty(ids) {
  return !ids.size
}
