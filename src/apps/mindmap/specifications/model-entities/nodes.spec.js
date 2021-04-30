import {
  createCollection,
  addToCollection,
  getFromCollection,
  replaceInCollection,
  removeFromCollection,
} from './collection'
import { testCases } from 'test-utils/jest'

describe('add to collection:', () => {
  testCases('new collection has new item', ({ item }) => {
    const nodes0 = createCollection()
    const [nodes1, id1] = addToCollection(nodes0, item)
    expect(getFromCollection(nodes1, id1)).toEqual(item)
  })([{ item: 'new item' }])

  testCases('initial collection remains the same', ({ item }) => {
    const nodes0 = createCollection()
    const [, id1] = addToCollection(nodes0, item)
    expect(getFromCollection(nodes0, id1)).toBeUndefined()
  })([{ item: 'not in initial collection' }])

  testCases('newest collection has two items', ({ firstItem, secondItem }) => {
    const nodes0 = createCollection()
    const [nodes1, id1] = addToCollection(nodes0, firstItem)
    const [nodes2, id2] = addToCollection(nodes1, secondItem)
    expect(getFromCollection(nodes2, id1)).toEqual(firstItem)
    expect(getFromCollection(nodes2, id2)).toEqual(secondItem)
  })([{ firstItem: 'first item', secondItem: 'second item' }])
})

describe('replace item in collection', () => {
  testCases('using id or predicate', ({ oldItem, newItem }) => {
    const nodes0 = createCollection()
    const [nodes1, id] = addToCollection(nodes0, oldItem)
    const nodes2 = replaceInCollection(nodes1, id, newItem)
    expect(getFromCollection(nodes2, id)).not.toEqual(oldItem)
    expect(getFromCollection(nodes2, id)).toEqual(newItem)
  })([{ oldItem: 'to be replaced', newItem: 'replacement' }])
})

describe('remove an item', () => {
  testCases('using id', ({ item }) => {
    const nodes0 = createCollection()
    const [nodes1, id] = addToCollection(nodes0, item)
    const nodes2 = removeFromCollection(nodes1, id)
    expect(getFromCollection(nodes2, id)).toBeUndefined()
  })([{ item: 'to be removed' }])
})
