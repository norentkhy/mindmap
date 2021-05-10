import { viewmodel } from '~mindmap/test-utilities'
import { describe, test, expect } from '@jest/globals'
import Collection from '../../data-structures/collection'

describe('node-folding: viewmodel', () => {
  test('toggle fold: fold and unfold', () => {
    const { state, action, actionSequence } = viewmodel.render()
    actionSequence.createRootNodeWithProperties({
      text: 'root node',
    })

    const [_, id] = Collection.last(state.getState().nodes)
    const initialNode = state.getNewestRootNode()
    expect(initialNode.folded).toBeFalsy()

    action.foldNode({collectionId: id})
    expect(state.getState().user.foldedNodes).toContain(id)

    action.foldNode({collectionId: id})
    expect(state.getState().user.foldedNodes).not.toContain(id)
  })

  test('toggle fold: fold and unfold', () => {
    const { state, action, actionSequence } = viewmodel.render()
    const { id } = actionSequence.createRootNodeWithProperties({
      text: 'root node',
    })

    const initialNode = state.getNewestRootNode()
    expect(initialNode.folded).toBeFalsy()

    action.foldNode({id})
    const foldedNode = state.getNewestRootNode()
    expect(foldedNode.folded).toBe(true)

    action.foldNode({id})
    const unfoldedNode = state.getNewestRootNode()
    expect(unfoldedNode.folded).toBe(false)
  })
})
