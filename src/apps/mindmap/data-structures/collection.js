import { v4 as uuidv4 } from 'uuid'

const Collection = {
  create: createCollection,
  add: addToCollection,
  replace: replaceInCollection,
  get: getFromCollection,
  remove: removeFromCollection,
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
