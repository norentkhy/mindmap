import { viewmodel } from '~mindmap/test-utilities'
import { describe, test, expect } from '@jest/globals'
import { mapMultipleArrays } from 'utils/FunctionalProgramming'
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
        const { state, action, actionSequence } = viewmodel.render()

        executeEventChain({ state, action, actionSequence }, layout)

        const desiredTreeCss = state.getNewestRootNode().desiredTreeCss
        expect(desiredTreeCss).toMatchObject(desiredTreeOffset)
      })

      test(
        'throw error on NaN offsets',
        disableConsoleErrorWithin(() => {
          const { state, action, actionSequence } = viewmodel.render()
          const nonsenseLayout = { boundingClientRect: {}, offsetRect: {} }
          expect(() => {
            action.registerSurfaceLayout(nonsenseLayout)
            action.createRootNode()
            const { id } = state.getNewestRootNode()
            action.registerTreeLayout({ id, ...nonsenseLayout })
            action.registerNodeLayout({ id, ...nonsenseLayout })
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
          { state, action, actionSequence },
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          action.registerSurfaceLayout(surfaceLayout)
          action.createRootNode()
          const { id } = state.getNewestRootNode()
          action.registerTreeLayout({ id, ...treeLayout })
          action.registerNodeLayout({ id, ...nodeLayout })
        }

        function registerTreeLayoutLast(
          { state, action, actionSequence },
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          action.registerSurfaceLayout(surfaceLayout)
          action.createRootNode()
          const { id } = state.getNewestRootNode()
          action.registerNodeLayout({ id, ...nodeLayout })
          action.registerTreeLayout({ id, ...treeLayout })
        }

        function registerSurfaceLayoutLast(
          { state, action, actionSequence },
          { surfaceLayout, treeLayout, nodeLayout }
        ) {
          action.createRootNode()
          const { id } = state.getNewestRootNode()
          action.registerNodeLayout({ id, ...nodeLayout })
          action.registerTreeLayout({ id, ...treeLayout })
          action.registerSurfaceLayout(surfaceLayout)
        }
      }
    })

    test('child node creations: no offset assignment', () => {
      const { state, action, actionSequence } = viewmodel.render()
      const parent = actionSequence.createRootNodeWithProperties({
        text: 'parent',
      })
      const child = actionSequence.createChildNodeWithProperties({
        parentId: parent.id,
        properties: { text: 'child' },
      })

      action.registerSurfaceLayout(surfaceLayout)
      action.registerTreeLayout({ id: child.id, ...treeLayout })
      action.registerNodeLayout({ id: child.id, ...nodeLayout })

      const childNode = state.getNode(child.id)
      expect(childNode).not.toHaveProperty('desiredTreeCss.offsetLeft')
      expect(childNode).not.toHaveProperty('desiredTreeCss.offsetTop')
    })
  })
})
