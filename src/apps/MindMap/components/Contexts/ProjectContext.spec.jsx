import { renderHook, act } from '@testing-library/react-hooks'
import { ProjectProvider, ProjectContext } from './ProjectContext'
import React, { useContext } from 'react'
import createMockResizeObserverHook from './createMockResizeObserverHook'
import { getArgsOfLastCall } from '../../utils/jestUtils'
import {
  getTrees,
  createRootNodeWithProperties,
  getNewestRootNode,
  getState,
  captureNewNodes,
  getNode,
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

describe('dimensions', () => {
  test('update of node dimensions', () => {
    const { result } = renderHookTestAndCreateRootNode()

    const { id, dimensions } = getNewestRootNode(result)
    expect(dimensions).toEqual({})

    const newDimensions = {
      left: 10,
      top: 10,
      right: 20,
      bottom: 20,
      width: 10,
      height: 10,
      x: 10,
      y: 10,
    }
    act(() =>
      result.current.updateNodeDimensions({
        id,
        dimensions: newDimensions,
      })
    )

    const node = getNewestRootNode(result)
    expect(getObservedDimensions(node)).toEqual(newDimensions)

    function renderHookTestAndCreateRootNode() {
      const rendered = renderHookTest()
      act(() => rendered.result.current.createRootNode())
      return rendered
    }
  })

  describe('placement of nodes', () => {
    test('properties before node creation', () => {
      const { result } = renderHookTest()
      expect(getOrigin(result)).toEqual({
        top: 100,
        left: 100,
      })
    })

    test('a single root node', () => {
      const { result } = renderHookTest()

      const node = createRootNodeWithDimensions(result)

      const origin = getOrigin(result)
      expect(getDesiredDimensions(node)).toEqual({
        left: origin.left,
        top: origin.top,
        inResponseTo: node.dimensions,
      })
    })

    test('multiple sibling root nodes', () => {
      const { result } = renderHookTest()

      const nodes = [...Array(9)].map(() =>
        createRootNodeWithDimensions(result)
      )

      const spaceBetweenNodes = 10
      nodes.forEach((node, i) => {
        if (i) {
          const closestOlderSibling = nodes[i - 1]
          expect(getDesiredDimensions(node)).toEqual({
            left: closestOlderSibling.dimensions.left,
            top:
              closestOlderSibling.dimensions.top +
              closestOlderSibling.dimensions.height +
              spaceBetweenNodes,
            inResponseTo: node.dimensions,
          })
        }
      })
    })

    function createChildNodeWithDimensions({ result, parentId }) {
      const { id } = createChildNode()
      simulateResizeEvent({
        result,
        id,
        newDimensions: createDimensions({ left: 10, top: 10 }),
      })

      return getNode({ result, id })

      function createChildNode() {
        const newNodes = captureNewNodes({
          result,
          change: () => {
            act(() => result.current.createChildNode(parentId))
          },
        })

        return newNodes[0]
      }
    }

    function createRootNodeWithDimensions(result) {
      act(() => result.current.createRootNode())
      const { id } = getNewestRootNode(result)
      simulateResizeEvent({
        result,
        id,
        newDimensions: createDimensions({ left: 10, top: 10 }),
      })

      return getNewestRootNode(result)
    }

    function simulateResizeEvent({ result, id, newDimensions }) {
      act(() =>
        result.current.updateNodeDimensions({ id, dimensions: newDimensions })
      )
    }

    function createDimensions({ left, top }) {
      const windowWidth = 640
      const windowHeight = 480
      const width = 50
      const height = 20

      return {
        x: left,
        y: top,
        left,
        right: windowWidth - width - left,
        top,
        bottom: windowHeight - height - top,
        width,
        height,
      }
    }
  })

  function getOrigin(result) {
    return result.current.state.origin
  }

  function getDesiredDimensions(node) {
    return node.desiredDimensions
  }

  function getObservedDimensions(node) {
    return node.dimensions
  }
})

describe('logging of changes', () => {
  test('dimensions update', () => {
    const { result, log } = renderHookTestWithNodeForLogging()

    const { id } = getNewestRootNode(result)
    const newDimensions = 'new dimensions'
    act(() =>
      result.current.updateNodeDimensions({ id, dimensions: newDimensions })
    )

    expect(log).toBeCalled()
    expect(getArgsOfLastCall(log)).toEqual([{ id, dimensions: newDimensions }])

    function renderHookTestWithNodeForLogging() {
      const log = jest.fn()
      const { result } = renderHookTest(log)
      act(() => result.current.createRootNode())

      return { result, log }
    }
  })
})

export function renderHookTest(log) {
  const { useMockResizeObserver } = createMockResizeObserverHook()

  return renderHook(() => useContext(ProjectContext), {
    wrapper: ({ children }) => (
      <ProjectProvider
        useThisResizeObserver={useMockResizeObserver}
        logResize={log}
      >
        {children}
      </ProjectProvider>
    ),
  })
}
