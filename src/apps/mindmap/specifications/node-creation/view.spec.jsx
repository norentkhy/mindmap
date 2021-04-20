import { MainView } from '~mindmap/components'
import { ui } from '~mindmap/test-utilities/view'
import { model } from '~mindmap/test-utilities/model'
import React from 'react'

describe('node creation view', () => {
  describe('display of node data', () => {
    test('single root node', () => {
      const node = renderWithOneRootNode()

      ui.expect.node(node).toBeVisible()

      function renderWithOneRootNode() {
        const node = model.create.node({ text: 'original text' })
        const initialState = model.create.state({ rootNodes: [node] })
        renderTest({ initialState })

        return node
      }
    })

    test('multiple root nodes', () => {
      const rootNodes = renderWithMultipleRootNodes()

      rootNodes.forEach((nodeInfo) => ui.expect.node(nodeInfo).toBeVisible())

      function renderWithMultipleRootNodes() {
        const {
          rootNodes,
          initialState,
        } = createInitialStateWithMultipleRootNodes()
        renderTest({ initialState })

        return rootNodes

        function createInitialStateWithMultipleRootNodes() {
          const nodeTexts = ['a', 'b', 'c', 'd']
          const rootNodes = nodeTexts.map((text) => model.create.node({ text }))
          const initialState = model.create.state({
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
        ui.expect.nodeInput().not.toBeVisible()

        ui.mouseAction.createRootNode()
        expect(createRootNode).toHaveBeenCalled()

        function renderTestForRootNodeCreation() {
          const createRootNode = jest.fn()
          renderTest({ modifications: { createRootNode } })

          return createRootNode
        }
      })

      test('edit', () => {
        const { node, finalizeEditNode } = renderNodeInEditMode()

        ui.expect.nodeInput().toHaveFocus()
        ui.expect.nodeInput().toHaveTextSelection(node.text)
        const someNewText = 'some new text'
        ui.keyboardAction.typeAndPressEnter(someNewText)

        expect(finalizeEditNode).toHaveBeenCalled()
        expect(finalizeEditNode).toBeCalledWith({
          id: node.id,
          text: someNewText,
        })

        function renderNodeInEditMode() {
          const { node, initialState } = createInitialStateWithNodeInEditMode()
          const finalizeEditNode = jest.fn()
          renderTest({
            initialState,
            modifications: { finalizeEditNode },
          })

          return { node, finalizeEditNode }

          function createInitialStateWithNodeInEditMode() {
            const node = model.create.node({
              text: 'original text',
              editing: true,
            })
            const initialState = model.create.state({
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

        ui.mouseAction.clickOn.node(rootNode)
        ui.keyboardAction.createChildNodeOfSelectedNode()

        expect(createChildNode).toHaveBeenCalled()
        expect(createChildNode).toBeCalledWith(rootNode.id)

        function renderWithOneRootNodeForChildNodeCreation() {
          const { rootNode, initialState } = createInitialStateWithOneRootNode()
          const createChildNode = jest.fn()
          renderTest({
            initialState,
            modifications: { createChildNode },
          })

          return { rootNode, createChildNode }

          function createInitialStateWithOneRootNode() {
            const rootNode = model.create.node({ text: 'root node' })
            const initialState = model.create.state({
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

        ui.expect.nodeInput().toHaveFocus()
        ui.expect.nodeInput().toHaveTextSelection(childNode.text)
        const someNewText = 'some new text'
        ui.keyboardAction.typeAndPressEnter(someNewText)

        expect(finalizeEditNode).toHaveBeenCalled()
        expect(finalizeEditNode).toBeCalledWith({
          id: childNode.id,
          text: someNewText,
        })

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
            const childNode = model.create.node({
              text: 'child',
              editing: true,
            })
            const rootNode = model.create.node({
              text: 'parent',
              children: [childNode],
            })
            const initialState = model.create.state({
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

        ui.mouseAction.clickOn.node({ text: parentNode.text })
        ui.mouseAction.editSelectedNode()

        expect(initiateEditNode).toHaveBeenCalled()
        expect(initiateEditNode).toBeCalledWith(parentNode.id)

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
            const childNode = model.create.node({ text: 'child' })
            const parentNode = model.create.node({
              text: 'parent',
              children: [childNode],
            })
            const initialState = model.create.state({
              rootNodes: [parentNode],
            })

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
  return ui.render(<MainView useThisModel={useMock} />)

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
