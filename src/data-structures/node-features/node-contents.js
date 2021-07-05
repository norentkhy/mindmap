import { Collection } from '../primitives'

export default {
  create: Collection.create,
  get: Collection.get,
  set: Collection.replace,
  getText,
  setText,
}

function getText(contents, id) {
  return Collection.get(contents, id)?.text
}

function setText(contents, id, text) {
  return Collection.modify(contents, id, (content) => {
    if (!content) return { text }
    return { ...content, text }
  })
}
