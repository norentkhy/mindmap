import { describe, test, expect } from '@jest/globals'
import { act } from '@testing-library/react-hooks'
import {
  getTrees,
  createRootNodeWithProperties,
  getNewestRootNode,
  renderHookTest,
} from '~mindmap/components/Contexts/TestUtilities'

describe('node creation', () => {
  test('handle root node creation', () => {
    const { result } = renderHookTest()
    expect(getTrees(result)).toEqual([])

    for (let i = 0; i < 5; i++) {
      act(() => result.current.createRootNode())

      const amountOfRootNodes = i + 1
      expect(getTrees(result).length).toBe(amountOfRootNodes)

      const node = getTrees(result)[i]
      expect(node.id).toBeTruthy()
      expect(node).toMatchObject({
        id: expect.any(String),
        text: '',
        editing: true,
      })
    }
  })

  test('handle child node creation', () => {
    const { result } = renderHookTest()
    const parentId = createRootNodeWithProperties(result, {
      text: 'root node',
    })

    act(() => result.current.createChildNode(parentId))
  })

  describe('node edit', () => {
    test('handle start', () => {
      const { result } = renderHookTest()
      const initialText = 'initial'
      const id = createRootNodeWithProperties(result, { text: initialText })

      act(() => result.current.initiateEditNode(id))

      expect(getNewestRootNode(result).editing).toBe(true)
    })

    test('handle end', () => {
      const { result } = renderHookTest()

      act(() => result.current.createRootNode())
      const { id } = getNewestRootNode(result)
      const someNewText = 'some new text'

      act(() => result.current.finalizeEditNode({ id, text: someNewText }))
      expect(getNewestRootNode(result).text).toBe(someNewText)
    })
  })
})
