import { Collection } from 'src/data-structures/primitives'

describe('add to collection:', () => {
  test.case('new collection has new item', ({ item }) => {
    const nodes0 = Collection.create()
    const [nodes1, id1] = Collection.add(nodes0, item)
    expect(Collection.get(nodes1, id1)).toEqual(item)
  })([{ item: 'new item' }])

  test.case('initial collection remains the same', ({ item }) => {
    const nodes0 = Collection.create()
    const [, id1] = Collection.add(nodes0, item)
    expect(Collection.get(nodes0, id1)).toBeUndefined()
  })([{ item: 'not in initial collection' }])

  test.case('newest collection has two items', ({ firstItem, secondItem }) => {
    const nodes0 = Collection.create()
    const [nodes1, id1] = Collection.add(nodes0, firstItem)
    const [nodes2, id2] = Collection.add(nodes1, secondItem)
    expect(Collection.get(nodes2, id1)).toEqual(firstItem)
    expect(Collection.get(nodes2, id2)).toEqual(secondItem)
  })([{ firstItem: 'first item', secondItem: 'second item' }])
})

describe('replace item in collection', () => {
  test.case('using id or predicate', ({ oldItem, newItem }) => {
    const nodes0 = Collection.create()
    const [nodes1, id] = Collection.add(nodes0, oldItem)
    const nodes2 = Collection.replace(nodes1, id, newItem)
    expect(Collection.get(nodes2, id)).not.toEqual(oldItem)
    expect(Collection.get(nodes2, id)).toEqual(newItem)
  })([{ oldItem: 'to be replaced', newItem: 'replacement' }])
})

describe('remove an item', () => {
  test.case('using id', ({ item }) => {
    const nodes0 = Collection.create()
    const [nodes1, id] = Collection.add(nodes0, item)
    const nodes2 = Collection.remove(nodes1, id)
    expect(Collection.get(nodes2, id)).toBeUndefined()
  })([{ item: 'to be removed' }])
})

describe('get last item', () => {
  test('no parameters', () => {
    const item = 'this is the last item'
    const nodes0 = Collection.create()
    const [nodes1, id1] = Collection.add(nodes0, item)
    expect(Collection.last(nodes1)).toEqual([item, id1])
  })
})
