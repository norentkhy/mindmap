import { describe, test, expect } from '@jest/globals'
import { viewmodel } from '~mindmap/test-utilities'

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

    action.createChildNode(parent.id)
  })

  describe('node edit', () => {
    test('handle start', () => {
      const { state, action, actionSequence } = viewmodel.render()
      const initialText = 'initial'
      const node = actionSequence.createRootNodeWithProperties({
        text: initialText,
      })

      action.initiateEditNode(node.id)

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
