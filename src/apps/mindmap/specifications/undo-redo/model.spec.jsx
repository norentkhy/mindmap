import { model } from '~mindmap/test-utilities'
import { describe, test, expect } from '@jest/globals'

describe('undo and redo', () => {
  test('undo and redo', () => {
    const { state, action, actionSequence, stateObservation } = model.render()
    const stateBefore = state.getState()
    action.createRootNode()
    const { id } = state.getNewestRootNode()
    const stateAfter = state.getState()

    action.undo()
    expect(state.getState()).toEqual(stateBefore)

    action.undo()
    expect(state.getState()).toEqual(stateBefore)

    action.redo()
    expect(state.getState()).toEqual(stateAfter)

    action.redo()
    expect(state.getState()).toEqual(stateAfter)

    action.finalizeEditNode({ id, text: 'this will be undone' })
    const stateToBeUndone = state.getState()
    action.undo()
    action.finalizeEditNode({ id, text: 'new name' })
    action.redo()
    expect(state.getState()).not.toEqual(stateToBeUndone)
  })
})
