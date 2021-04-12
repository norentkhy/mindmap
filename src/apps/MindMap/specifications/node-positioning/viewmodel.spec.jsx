import { describe, test, expect } from '@jest/globals'
import { act } from '@testing-library/react-hooks'
import { mapMultipleArrays, mapObject } from 'utils/FunctionalProgramming'
import {
  createRootNodeWithProperties,
  getNewestRootNode,
  renderHookTest,
  getNode,
  createChildNodeWithProperties,
} from '~mindmap/components/Contexts/TestUtilities'
import { disableConsoleErrorWithin } from 'utils/JestTools'

describe('dimensions', () => {
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
})

function getActionsOnResult(result) {
  const { state, ...actions } = result.current
  const wrappedActions = mapObject(actions, wrapActionInAct)

  return wrappedActions

  function wrapActionInAct(doAction) {
    return (...args) => act(() => doAction(...args))
  }
}
