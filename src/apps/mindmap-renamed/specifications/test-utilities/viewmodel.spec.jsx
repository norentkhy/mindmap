import { act } from '@testing-library/react-hooks'
import {
  getNode,
  createRootNodeWithProperties,
  getRootNodes,
  captureNewNodes,
  createChildNodeWithProperties,
  renderHookTest,
} from '~mindmap/test-utilities/viewmodel'

describe('utilities', () => {
  test('createRootNodeWithProperties', () => {
    const { result } = renderHookTest()
    const text = 'tesadf'
    const rootNodeId = createRootNodeWithProperties(result, { text })

    const rootNodes = getRootNodes(result)

    expect(rootNodes.length).toBe(1)
    expect(rootNodes[0].id).toBe(rootNodeId)
  })

  test('captureNodeChanges', () => {
    const { result } = renderHookTest()
    const firstRootNode = createAndCaptureFirstRootNode()
    createAndCaptureSecondRootNode()
    createAndCaptureFirstChildNode(firstRootNode.id)

    function createAndCaptureFirstRootNode() {
      const nodeChanges = captureNewNodes({
        result,
        change: () => createRootNodeWithProperties(result, { text: 'asdf' }),
      })

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: 'asdf', editing: false })

      return nodeChanges[0]
    }

    function createAndCaptureSecondRootNode() {
      const nodeChanges = captureNewNodes({
        result,
        change: () => createRootNodeWithProperties(result, { text: 'second' }),
      })

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: 'second', editing: false })
    }

    function createAndCaptureFirstChildNode(rootId) {
      const nodeChanges = captureNewNodes({
        result,
        change: () => {
          act(() => result.current.createChildNode(rootId))
        },
      })

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: '', editing: true })
    }
  })

  test('createChildNodeWithProperties', () => {
    const { result } = renderHookTest()

    const parentId = createRootNodeWithProperties(result, { text: 'parent' })

    const text = 'child'
    const newNodes = captureNewNodes({
      result,
      change: () =>
        createChildNodeWithProperties({
          result,
          parentId,
          properties: { text },
        }),
    })

    expect(newNodes.length).toBe(1)
    expect(newNodes[0]).toMatchObject({ text })
  })

  test('getNode', () => {
    const { result } = renderHookTest()

    const parentId = createRootNodeWithProperties(result, {
      text: 'I am parent',
    })
    const childId = createChildNodeWithProperties({
      result,
      parentId,
      properties: { text: 'I am child' },
    })

    const node = getNode({ result, id: childId })

    expect(node.id).toBe(childId)
  })
})
