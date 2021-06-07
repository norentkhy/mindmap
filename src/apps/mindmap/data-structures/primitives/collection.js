import produce from 'immer'
import { v4 as uuidv4 } from 'uuid'

const Collection = {
  create: createCollection,
  add: addToCollection,
  replace: replaceInCollection,
  get: getFromCollection,
  remove: removeFromCollection,
  last: getLastFromCollection,
  map: mapCollection,
  filter: filterCollection,
  reduce:  reduceCollection,
  modify: modifyItemInCollection,
}

function createCollection(...args) {
  return new Map(...args)
}

function addToCollection(collection, item) {
  const id = createCollectionId()
  const newCollection = replaceInCollection(collection, id, item)
  return [newCollection, id]
}

function replaceInCollection(collection, id, item) {
  const newCollection = createCollection(collection)
  newCollection.set(id, item)
  return newCollection
}

function getFromCollection(collection, id) {
  return collection.get(id)
}

function removeFromCollection(collection, id) {
  const newCollection = createCollection(collection)
  newCollection.delete(id)
  return newCollection
}

function getLastFromCollection(collection) {
  const idsAndItems = getIdsAndItems(collection)
  const [id, item] = idsAndItems[idsAndItems.length - 1]
  return [item, id]
}

function mapCollection(collection, applyMapping) {
  const idsAndItems = getIdsAndItems(collection)
  return idsAndItems.map(applyMapping)
}

function filterCollection(collection, applyFilter) {
  const idsAndItems = getIdsAndItems(collection)
  return idsAndItems.filter(applyFilter)
}

function reduceCollection(collection, applyReducer, initial) {
  const idsAndItems = getIdsAndItems(collection)
  return idsAndItems.reduce(applyReducer, initial)
}

function getIdsAndItems(collection) {
  return Array.from(collection)
}

function modifyItemInCollection(collection, id, modify) {
  const item = getFromCollection(collection, id)
  const newItem = produce(item, modify)
  return replaceInCollection(collection, id, newItem)
}

function createCollectionId() {
  return uuidv4()
}

export default Collection

export {
  createCollection,
  addToCollection,
  replaceInCollection,
  getFromCollection,
  removeFromCollection,
}
