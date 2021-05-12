import { describe, test, expect } from '@jest/globals'
import { viewmodel } from '~mindmap/test-utilities'
import Collection from '~mindmap/data-structures/collection'
import { repeat } from '~/utils/FunctionalProgramming'

describe('root node', () => {
  test('collection of nodes exists', () => {
    const { state } = viewmodel.render()
    expect(state.getState().nodes).not.toBeUndefined()
  })

  test('collection of nodes initialized with no nodes', () => {
    const { state } = viewmodel.render()
    expect(state.getState().nodes.size).toBe(0)
  })

  test.case('root node creation', ({ n }) => {
    const { state, action } = viewmodel.render()
    repeat(n, () => action.createRootNode())
    expect(state.getState().nodes.size).toBe(n)
  })([{ n: 1 }, { n: 5 }])

  test('newly created nodes have no content', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    expect(Collection.last(state.getState().nodes)).toEqual([
      { id: viewmodel.expect.anId() },
      viewmodel.expect.anId(),
    ])
  })
})

describe('editing a node', () => {
  test('initially no node is being edited', () => {
    const { state } = viewmodel.render()
    expect(state.getState().user.editingNodes).toEqual([])
  })

  test.case('newly created nodes will immediately be edited', ({ n }) => {
    const { state, action } = viewmodel.render()
    repeat(n, () => action.createRootNode())
    expect(state.getState().user.editingNodes).toEqual(
      Collection.map(state.getState().nodes, ([id]) => id)
    )
  })([{ n: 1 }, { n: 7 }])

  test('newly created node gets focus', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    expect(state.getState().user.focusedNode).toBe(id)
  })

  test('finishing node edit modifies node in collection', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.finalizeEditNode({ collectionId: id, text: 'finished' })
    expect(Collection.get(state.getState().nodes, id)).toMatchObject({
      text: 'finished',
    })
  })

  test('finishing removes it from edit', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.finalizeEditNode({ collectionId: id, text: 'checking edit list' })
    expect(state.getState().user.editingNodes).not.toContain(id)
  })

  test('node edit finish does not remove focus', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.finalizeEditNode({ collectionId: id, text: 'checking edit list' })
    expect(state.getState().user.focusedNode).toBe(id)
  })

  test('initiate node edit', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.finalizeEditNode({ collectionId: id, text: 'checking edit list' })
    action.initiateEditNode({ collectionId: id })
    expect(state.getState().user.editingNodes).toContain(id)
  })

  test('node edit initiation gets focus', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.finalizeEditNode({ collectionId: id, text: 'checking edit list' })
    action.initiateEditNode({ collectionId: id })
    expect(state.getState().user.focusedNode).toBe(id)
  })
})

describe('child node', () => {
  test('initially no arrows', () => {
    const { state } = viewmodel.render()
    expect(state.getState().arrows.size).toBe(0)
  })

  test('child node creation also creates a node', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.createChildNode({ parentCollectionId: id })
    expect(state.getState().nodes.size).toBe(2)
  })

  test('child node creation creates an arrow', () => {
    const { state, action } = viewmodel.render()
    action.createRootNode()
    const [_, id] = Collection.last(state.getState().nodes)
    action.createChildNode({ parentCollectionId: id })
    const [_child, childId] = Collection.last(state.getState().nodes)
    expect(Collection.get(state.getState().arrows, id)).toEqual(childId)
  })
})

describe('node creation', () => {
  test('handle root node creation', () => {
    const { state, action } = viewmodel.render()
    expect(state.getRootNodes()).toEqual([])

    for (let i = 0; i < 5; i++) {
      action.createRootNode()

      const amountOfRootNodes = i + 1
      expect(state.getRootNodes().length).toBe(amountOfRootNodes)

      const node = state.getNewestRootNode()
      expect(node.id).toBeTruthy()
      expect(node).toMatchObject({
        id: expect.any(String),
        text: '',
        editing: true,
      })
    }
  })

  test('handle child node creation', () => {
    const { action, actionSequence } = viewmodel.render()
    const parent = actionSequence.createRootNodeWithProperties({
      text: 'root node',
    })

    action.createChildNode({ parentId: parent.id })
  })

  describe('node edit', () => {
    test('handle start', () => {
      const { state, action, actionSequence } = viewmodel.render()

      const initialText = 'initial'
      const node = actionSequence.createRootNodeWithProperties({
        text: initialText,
      })

      action.initiateEditNode({ id: node.id })

      expect(state.getNode(node.id).editing).toBe(true)
    })

    test('handle end', () => {
      const { state, action } = viewmodel.render()
      action.createRootNode()
      const { id } = state.getNewestRootNode()

      const someNewText = 'some new text'
      action.finalizeEditNode({ id, text: someNewText })

      expect(state.getNode(id).text).toBe(someNewText)
    })
  })
})
