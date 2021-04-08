import { describe, test, expect } from '@jest/globals'
import { act } from '@testing-library/react-hooks'
import {
  getTrees,
  createRootNodeWithProperties,
  getNewestRootNode,
  getState,
  renderHookTest,
} from './TestUtilities'

describe('core', () => {
  describe('create a root node', () => {
    test('create root node and set it to edit mode', () => {
      const { result } = renderHookTest()
      expect(getTrees(result)).toEqual([])

      act(() => result.current.createRootNode())
      expect(getTrees(result).length).toBe(1)

      const node = getTrees(result)[0]
      expect(node.id).toBeTruthy()
      expect(node).toMatchObject({
        text: '',
        editing: true,
      })
    })

    test('receive command to initiate editing', () => {
      const { result } = renderHookTest()
      const initialText = 'initial'
      const id = createRootNodeWithProperties(result, { text: initialText })

      act(() => result.current.initiateEditNode(id))

      expect(getNewestRootNode(result).editing).toBe(true)
    })

    test('receive command to finalize editing', () => {
      const { result } = renderHookTest()

      act(() => result.current.createRootNode())
      const { id } = getNewestRootNode(result)
      const someNewText = 'some new text'

      act(() => result.current.finalizeEditNode({ id, text: someNewText }))
      expect(getNewestRootNode(result).text).toBe(someNewText)
    })

    test('make multiple rootnodes', () => {
      const { result } = renderHookTest()

      const nodeTexts = ['root1', 'root2']
      nodeTexts.forEach((text) => {
        createRootNodeWithProperties(result, { text })
        expect(getNewestRootNode(result)).toMatchObject({ text })
      })
    })
  })

  describe('create a child node', () => {
    test('create a child node and set it to edit mode', () => {
      const { result } = renderHookTest()
      const parentId = createRootNodeWithProperties(result, {
        text: 'root node',
      })

      act(() => result.current.createChildNode(parentId))
    })
  })

  describe('fold a node', () => {
    test('fold a node', () => {
      const { result } = renderHookTest()
      const id = createRootNodeWithProperties(result, { text: 'root node' })

      const initialNode = getNewestRootNode(result)
      expect(initialNode.folded).toBeFalsy()

      act(() => result.current.foldNode(id))
      const foldedNode = getNewestRootNode(result)
      expect(foldedNode.folded).toBe(true)

      act(() => result.current.foldNode(id))
      const unfoldedNode = getNewestRootNode(result)
      expect(unfoldedNode.folded).toBe(false)
    })
  })
})

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
