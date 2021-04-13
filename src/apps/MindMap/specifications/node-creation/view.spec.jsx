import React from 'react'
import { render } from '@testing-library/react'
import { MainView } from '~mindmap/components/MainView/MainView'
import { v4 as uuidv4 } from 'uuid'
import { getInputSelection } from 'test-utils/dom'
import {
  createDataStructure,
  queryNode,
  queryNodeInput,
  ui,
  getFocus,
} from '~mindmap/test-utilities/view'
import 'jest-styled-components'

describe('node creation view', () => {
  describe('display of node data', () => {
    test('single root node', () => {
      const node = renderWithOneRootNode()
      expect(queryNode({ text: node.text })).toBeVisible()

      function renderWithOneRootNode() {
        const node = createDataStructure.node({ text: 'original text' })
        const initialState = createDataStructure.state({ rootNodes: [node] })
        renderTest({ initialState })

        return node
      }
    })

    test('multiple root nodes', () => {
      const rootNodes = renderWithMultipleRootNodes()

      rootNodes.forEach(({ text }) => expect(queryNode({ text })).toBeVisible())

      function renderWithMultipleRootNodes() {
        const {
          rootNodes,
          initialState,
        } = createInitialStateWithMultipleRootNodes()
        renderTest({ initialState })

        return rootNodes

        function createInitialStateWithMultipleRootNodes() {
          const nodeTexts = ['a', 'b', 'c', 'd']
          const rootNodes = nodeTexts.map((text) =>
            createDataStructure.node({ text })
          )
          const initialState = createDataStructure.state({
            rootNodes,
          })
          return { rootNodes, initialState }
        }
      }
    })
  })

  describe('user stories', () => {
    describe('create root node and give it text', () => {
      test('create', () => {
        const createRootNode = renderTestForRootNodeCreation()
        expect(queryNodeInput()).toBeNull()

        ui.createRootNode()
        expect(createRootNode).toHaveBeenCalled()

        function renderTestForRootNodeCreation() {
          const createRootNode = jest.fn()
          renderTest({ modifications: { createRootNode } })

          return createRootNode
        }
      })

      test('edit', () => {
        const { node, finalizeEditNode } = renderNodeInEditMode()

        const Focus = getFocus()
        expect(getInputSelection(Focus)).toBe(node.text)

        const someNewText = 'some new text'
        ui.typeAndPressEnter(someNewText)

        expect(finalizeEditNode).toHaveBeenCalled()
        expect(finalizeEditNode.mock.calls[0]).toEqual([
          { id: node.id, text: someNewText },
        ])

        function renderNodeInEditMode() {
          const { node, initialState } = createInitialStateWithNodeInEditMode()
          const finalizeEditNode = jest.fn()
          renderTest({
            initialState,
            modifications: { finalizeEditNode },
          })

          return { node, finalizeEditNode }

          function createInitialStateWithNodeInEditMode() {
            const node = createDataStructure.node({
              text: 'original text',
              editing: true,
            })
            const initialState = createDataStructure.state({
              rootNodes: [node],
            })
            return { node, initialState }
          }
        }
      })
    })

    describe('create child node and give it text', () => {
      test('creation of a child node', () => {
        const {
          rootNode,
          createChildNode,
        } = renderWithOneRootNodeForChildNodeCreation()

        ui.selectNode({ text: rootNode.text })
        ui.createChildNodeOfSelectedNode()

        expect(createChildNode).toHaveBeenCalled()
        expect(createChildNode.mock.calls[0]).toEqual([rootNode.id])

        function renderWithOneRootNodeForChildNodeCreation() {
          const { rootNode, initialState } = createInitialStateWithOneRootNode()
          const createChildNode = jest.fn()
          renderTest({
            initialState,
            modifications: { createChildNode },
          })

          return { rootNode, createChildNode }

          function createInitialStateWithOneRootNode() {
            const rootNode = createDataStructure.node({ text: 'root node' })
            const initialState = createDataStructure.state({
              rootNodes: [rootNode],
            })
            return { rootNode, initialState }
          }
        }
      })

      test('naming of a created child node', () => {
        const {
          childNode,
          finalizeEditNode,
        } = renderTestWithChildNodeInEditMode()

        const Focus = getFocus()
        expect(getInputSelection(Focus)).toBe(childNode.text)

        const someNewText = 'some new text'
        ui.typeAndPressEnter(someNewText)

        expect(finalizeEditNode).toHaveBeenCalled()
        expect(finalizeEditNode.mock.calls[0]).toEqual([
          { id: childNode.id, text: someNewText },
        ])

        function renderTestWithChildNodeInEditMode() {
          const {
            childNode,
            initialState,
          } = createInitialStateWithChildNodeInEditMode()
          const finalizeEditNode = jest.fn()
          renderTest({
            initialState,
            modifications: { finalizeEditNode },
          })

          return { childNode, finalizeEditNode }

          function createInitialStateWithChildNodeInEditMode() {
            const childNode = createDataStructure.node({
              text: 'child',
              editing: true,
            })
            const rootNode = createDataStructure.node({
              text: 'parent',
              children: [childNode],
            })
            const initialState = createDataStructure.state({
              rootNodes: [rootNode],
            })

            return { childNode, initialState }
          }
        }
      })
    })

    describe('select node and give it new text', () => {
      test('select node and start edit', () => {
        const {
          parentNode,
          initiateEditNode,
        } = renderTestWithParentAndChildNode()

        ui.selectNode({ text: parentNode.text })
        ui.editSelectedNode()

        expect(initiateEditNode).toHaveBeenCalled()
        expect(initiateEditNode.mock.calls[0]).toEqual([parentNode.id])

        function renderTestWithParentAndChildNode() {
          const {
            initialState,
            parentNode,
          } = createInitialStateWithParentAndChildNode()
          const initiateEditNode = jest.fn()

          renderTest({
            initialState,
            modifications: { initiateEditNode },
          })

          return { parentNode, initiateEditNode }

          function createInitialStateWithParentAndChildNode() {
            const childNode = { id: uuidv4(), text: 'child' }
            const parentNode = {
              id: uuidv4(),
              text: 'parent',
              children: [childNode],
            }
            const initialState = {
              trees: [parentNode],
            }

            return { initialState, parentNode }
          }
        }
      })
    })
  })
})

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  return render(<MainView useThisModel={useMock} />)

  function useMock() {
    return {
      state: initialState,
      useThisResizeObserver() {},
      registerNodeLayout() {},
      registerTreeLayout() {},
      adjustRootTree() {},
      ...modifications,
    }
  }
}
