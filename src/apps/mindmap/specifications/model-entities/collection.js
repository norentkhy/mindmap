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
  return Symbol()
}

export {
  createCollection,
  addToCollection,
  replaceInCollection,
  getFromCollection,
  removeFromCollection,
}
