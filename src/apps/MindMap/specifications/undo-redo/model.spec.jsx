import {
  getNewestRootNode,
  getState,
  renderHookTest,
} from '~mindmap/test-utilities/viewmodel'
import { act } from '@testing-library/react-hooks'
import { describe, test, expect } from '@jest/globals'

describe('undo and redo', () => {
  test('undo and redo', () => {
    const { result } = renderHookTest()
    const stateBefore = getState(result)
    createNode()
    const stateAfter = getState(result)

    undo()
    expect(getState(result)).toEqual(stateBefore)

    undo()
    expect(getState(result)).toEqual(stateBefore)

    redo()
    expect(getState(result)).toEqual(stateAfter)

    redo()
    expect(getState(result)).toEqual(stateAfter)

    renameNode('this will be undone')
    const stateToBeUndone = getState(result)
    undo()
    renameNode('new name')
    redo()
    expect(getState(result)).not.toEqual(stateToBeUndone)

    function renameNode(text) {
      act(() =>
        result.current.finalizeEditNode({
          id: getNewestRootNode(result).id,
          text,
        })
      )
    }

    function createNode() {
      act(result.current.createRootNode)
    }

    function undo() {
      act(() => result.current.undo())
    }

    function redo() {
      act(() => result.current.redo())
    }
  })
})
