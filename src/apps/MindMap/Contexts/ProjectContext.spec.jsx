import { renderHook, act } from '@testing-library/react-hooks'
import { ProjectProvider, ProjectContext } from './ProjectContext'
import React, { useContext } from 'react'
import createMockResizeObserverHook from './createMockResizeObserverHook.spec'
import { getArgsOfLastCall } from '../utils/jestUtils'

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
    expect(node.dimensions).toEqual(newDimensions)

    function renderHookTestAndCreateRootNode() {
      const rendered = renderHookTest()
      act(() => rendered.result.current.createRootNode())
      return rendered
    }
  })
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

function captureNewNodes({ result, change }) {
  const oldNodes = getRootNodes(result)
  change()
  const nodes = getRootNodes(result)

  const newNodes = getNewNodes({ oldNodes, nodes })

  return newNodes

  function getNewNodes({ oldNodes, nodes }) {
    const oldIds = getIds(oldNodes)
    const ids = getIds(nodes)
    const newIds = ids.filter((id) => !oldIds.includes(id))

    const newNodes = newIds.map((id) => getNode({ id, nodes }))

    return newNodes

    function getIds(nodes) {
      return nodes.flatMap(({ children, id }) => {
        if (!children) return id

        return [id, ...getIds(children)]
      })
    }

    function getNode({ id, nodes }) {
      if (nodes.length === 0) return null

      const foundNode = nodes.find((node) => node.id === id)
      if (foundNode) return foundNode

      const childNodes = nodes.reduce((childNodes, { children }) => {
        if (!children || children.length === 0) return childNodes
        return [...childNodes, ...children]
      }, [])
      return getNode({ id, nodes: childNodes })
    }
  }
}

function renderHookTest(log) {
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

function createRootNodeWithProperties(result, { text, ...others }) {
  act(() => result.current.createRootNode())
  const { id } = getNewestRootNode(result)
  act(() => result.current.finalizeEditNode({ id, text, ...others }))
  return id
}

function createChildNodeWithProperties({
  result,
  parentId,
  properties: { text, ...others },
}) {
  const newNodes = captureNewNodes({
    result,
    change: () => {
      act(() => result.current.createChildNode(parentId))
    },
  })
  const { id } = newNodes[0]
  act(() => result.current.finalizeEditNode({ id, text, ...others }))
  return id
}

function getRootNodes(result) {
  const state = getState(result)
  return state.trees
}

function getNewestRootNode(result) {
  const rootNodes = getRootNodes(result)
  return rootNodes[rootNodes.length - 1]
}

function getState(result) {
  return result.current.state
}

function getTrees(result) {
  return getState(result).trees
}
