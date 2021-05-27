import Collection from './collection'

export default {
  get: getChildren
}

function getChildren(children, parentId) {
  const registeredChildren = Collection.get(children, parentId)
  if (!registeredChildren) return []
  return registeredChildren
}