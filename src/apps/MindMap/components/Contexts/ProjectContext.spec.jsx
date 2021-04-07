import { describe, test, expect } from '@jest/globals'
import { act } from '@testing-library/react-hooks'
import { mapMultipleArrays, mapObject } from 'utils/FunctionalProgramming'
import {
  getTrees,
  createRootNodeWithProperties,
  getNewestRootNode,
  getState,
  renderHookTest,
  getNode,
  createChildNodeWithProperties,
} from './TestUtilities'
import { disableConsoleErrorWithin } from 'utils/JestTools'

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
  test('update of node layout dimensions', () => {
    const { result } = renderHookTestAndCreateRootNode()
    const { id } = getNewestRootNode(result)

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerNodeLayout({
        id,
        boundingClientRect,
        offsetRect,
      })
    )

    const node = getNewestRootNode(result)
    expect(node.measuredNode).toEqual({ boundingClientRect, offsetRect })
  })

  test('update of tree layout dimensions', () => {
    const { result } = renderHookTestAndCreateRootNode()
    const { id } = getNewestRootNode(result)

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerTreeLayout({
        id,
        boundingClientRect,
        offsetRect,
      })
    )

    const node = getNewestRootNode(result)
    expect(node.measuredTree).toEqual({ boundingClientRect, offsetRect })
  })

  test('update mind surface layout dimensions', () => {
    const { result } = renderHookTest()

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    act(() =>
      result.current.registerSurfaceLayout({
        boundingClientRect,
        offsetRect,
      })
    )

    const { measuredSurface } = getState(result)
    expect(measuredSurface).toEqual({
      boundingClientRect,
      offsetRect,
    })
  })

  describe('offset assignments', () => {
    const layout = createLayoutSituation()
    const { surfaceLayout, treeLayout, nodeLayout } = layout

    function createLayoutSituation() {
      const surfaceLayout = {
        boundingClientRect: { left: 0, top: 0, width: 640, height: 480 },
        offsetRect: { left: 0, top: 0, width: 640, height: 480 },
      }

      const treeLayout = {
        boundingClientRect: { left: 40, top: 50, width: 90, height: 60 },
        offsetRect: { left: 40, top: 50, width: 90, height: 60 },
      }

      const nodeLayout = {
        boundingClientRect: { left: 40, top: 70, width: 40, height: 20 },
        offsetRect: { left: 0, top: 0, width: 40, height: 20 },
      }

      return { surfaceLayout, treeLayout, nodeLayout }
    }

    describe('single root node creation', () => {
      const desiredTreeOffset = computeDesiredTreeOffset(layout)
      const eventChains = definePlausibleEventChains()

      test.each(eventChains)('event chain: %p', (executeEventChain) => {
        const { result } = renderHookTest()

        executeEventChain(result, layout)

        const desiredTreeCss = getNewestRootNode(result).desiredTreeCss
        expect(desiredTreeCss).toMatchObject(desiredTreeOffset)
      })

      test(
        'throw error on NaN offsets',
        disableConsoleErrorWithin(() => {
          const { result } = renderHookTest()
          const nonsenseLayout = { boundingClientRect: {}, offsetRect: {} }
          expect(() => {
            const {
              registerTreeLayout,
              registerSurfaceLayout,
              registerNodeLayout,
              createRootNode,
            } = getActionsOnResult(result)

            registerSurfaceLayout(nonsenseLayout)
            createRootNode()
            const { id } = getNewestRootNode(result)
            registerTreeLayout({ id, ...nonsenseLayout })
            registerNodeLayout({ id, ...nonsenseLayout })
          }).toThrowError()
        })
      )

      function computeDesiredTreeOffset({
        surfaceLayout,
        treeLayout,
        nodeLayout,
      }) {
        const surfaceCenter = getBoundingClientCenter(surfaceLayout)
        const nodeCenter = getBoundingClientCenter(nodeLayout)
        const distanceToCenter = mapMultipleArrays(
          [surfaceCenter, nodeCenter],
          (surface, node) => surface - node
        )
        const treeLeftTop = [
          treeLayout.offsetRect.left,
          treeLayout.offsetRect.top,
        ]

        const desiredOffsetArray = mapMultipleArrays(
          [treeLeftTop, distanceToCenter],
          (tree, distance) => tree + distance
        )

        return {
          offsetLeft: desiredOffsetArray[0],
          offsetTop: desiredOffsetArray[1],
        }

        function getBoundingClientCenter({
          boundingClientRect: { left, top, width, height },
        }) {
          return [left + width / 2, top + height / 2]
        }
      }

      function definePlausibleEventChains() {
        return [
          registerNodeLayoutLast,
          registerTreeLayoutLast,
          registerSurfaceLayoutLast,
        ]

        function registerNodeLayoutLast(
          result,
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          const {
            registerTreeLayout,
            registerSurfaceLayout,
            registerNodeLayout,
            createRootNode,
          } = getActionsOnResult(result)

          registerSurfaceLayout(surfaceLayout)
          createRootNode()
          const { id } = getNewestRootNode(result)
          registerTreeLayout({ id, ...treeLayout })
          registerNodeLayout({ id, ...nodeLayout })
        }

        function registerTreeLayoutLast(
          result,
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          const {
            registerTreeLayout,
            registerSurfaceLayout,
            registerNodeLayout,
            createRootNode,
          } = getActionsOnResult(result)

          registerSurfaceLayout(surfaceLayout)
          createRootNode()
          const { id } = getNewestRootNode(result)
          registerNodeLayout({ id, ...nodeLayout })
          registerTreeLayout({ id, ...treeLayout })
        }

        function registerSurfaceLayoutLast(
          result,
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          const {
            registerTreeLayout,
            registerSurfaceLayout,
            registerNodeLayout,
            createRootNode,
          } = getActionsOnResult(result)

          createRootNode()
          const { id } = getNewestRootNode(result)
          registerNodeLayout({ id, ...nodeLayout })
          registerTreeLayout({ id, ...treeLayout })
          registerSurfaceLayout(surfaceLayout)
        }
      }
    })

    test('child node creations: no offset assignment', () => {
      const { result } = renderHookTest()
      const {
        registerTreeLayout,
        registerSurfaceLayout,
        registerNodeLayout,
      } = getActionsOnResult(result)

      const parentId = createRootNodeWithProperties(result, { text: 'parent' })
      const childId = createChildNodeWithProperties({
        result,
        parentId,
        properties: { text: 'child' },
      })

      registerSurfaceLayout(surfaceLayout)
      registerTreeLayout({ id: childId, ...treeLayout })
      registerNodeLayout({ id: childId, ...nodeLayout })

      const childNode = getNode({ result, id: childId })
      expect(childNode).not.toHaveProperty('desiredTreeCss.offsetLeft')
      expect(childNode).not.toHaveProperty('desiredTreeCss.offsetTop')
    })
  })

  function renderHookTestAndCreateRootNode() {
    const rendered = renderHookTest()
    act(() => rendered.result.current.createRootNode())
    return rendered
  }
})

function getActionsOnResult(result) {
  const { state, ...actions } = result.current
  const wrappedActions = mapObject(actions, wrapActionInAct)

  return wrappedActions

  function wrapActionInAct(doAction) {
    return (...args) => act(() => doAction(...args))
  }
}

describe('logging of changes', () => {
  test('dimensions update', () => {
    const { result, log } = renderHookTestWithNodeForLogging()

    const { id } = getNewestRootNode(result)
    const boundingClientRect = 'bounding client rectangle'
    const offsetRect = {
      offsetLeft: 'offset left',
      offsetTop: 'offset top',
      offsetWidth: 'offset width',
      offsetHeight: 'offset height',
    }
    act(() =>
      result.current.registerNodeLayout({
        id,
        boundingClientRect: boundingClientRect,
        offsetRect,
      })
    )

    expect(log).toBeCalled()
    expect(log).toBeCalledWith({ id, boundingClientRect, offsetRect })

    function renderHookTestWithNodeForLogging() {
      const log = jest.fn()
      const { result } = renderHookTest(log)
      act(() => result.current.createRootNode())

      return { result, log }
    }
  })
})
