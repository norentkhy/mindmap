import { describe, test, expect } from '@jest/globals'
import { act } from '@testing-library/react-hooks'
import {
  getTrees,
  createRootNodeWithProperties,
  getNewestRootNode,
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
})
