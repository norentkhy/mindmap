import { MainView } from '~mindmap/components'
import { view, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('node creation view', () => {
  describe('display of node data', () => {
    test('single root node', () => {
      const node = renderWithOneRootNode()

      view.expect.node(node).toBeVisible()

      function renderWithOneRootNode() {
        const node = viewmodel.create.node({ text: 'original text' })
        const initialState = viewmodel.create.state({ rootNodes: [node] })
        renderTest({ initialState })

        return node
      }
    })

    test('multiple root nodes', () => {
      const rootNodes = renderWithMultipleRootNodes()

      rootNodes.forEach((nodeInfo) => view.expect.node(nodeInfo).toBeVisible())

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
            viewmodel.create.node({ text })
          )
          const initialState = viewmodel.create.state({
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
        view.expect.nodeInput().not.toBeVisible()

        view.action.mouse.createRootNode()
        viewmodel.expect.mockFunction(createRootNode).toBeCalled()

        function renderTestForRootNodeCreation() {
          const createRootNode = viewmodel.create.mockFunction()
          renderTest({ modifications: { createRootNode } })

          return createRootNode
        }
      })

      test('edit', () => {
        const { node, finalizeEditNode } = renderNodeInEditMode()

        view.expect.nodeInput().toHaveFocus()
        view.expect.nodeInput().toHaveTextSelection(node.text)
        const someNewText = 'some new text'
        view.action.keyboard.typeAndPressEnter(someNewText)

        viewmodel.expect.mockFunction(finalizeEditNode).toBeCalled()
        viewmodel.expect.mockFunction(finalizeEditNode).toBeCalledWith({
          id: node.id,
          text: someNewText,
        })

        function renderNodeInEditMode() {
          const { node, initialState } = createInitialStateWithNodeInEditMode()
          const finalizeEditNode = viewmodel.create.mockFunction()
          renderTest({
            initialState,
            modifications: { finalizeEditNode },
          })

          return { node, finalizeEditNode }

          function createInitialStateWithNodeInEditMode() {
            const node = viewmodel.create.node({
              text: 'original text',
              editing: true,
            })
            const initialState = viewmodel.create.state({
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

        view.action.mouse.clickOn.node(rootNode)
        view.action.keyboard.createChildNodeOfSelectedNode()

        viewmodel.expect.mockFunction(createChildNode).toBeCalled()
        viewmodel.expect
          .mockFunction(createChildNode)
          .toBeCalledWith(rootNode.id)

        function renderWithOneRootNodeForChildNodeCreation() {
          const { rootNode, initialState } = createInitialStateWithOneRootNode()
          const createChildNode = viewmodel.create.mockFunction()
          renderTest({
            initialState,
            modifications: { createChildNode },
          })

          return { rootNode, createChildNode }

          function createInitialStateWithOneRootNode() {
            const rootNode = viewmodel.create.node({ text: 'root node' })
            const initialState = viewmodel.create.state({
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

        view.expect.nodeInput().toHaveFocus()
        view.expect.nodeInput().toHaveTextSelection(childNode.text)
        const someNewText = 'some new text'
        view.action.keyboard.typeAndPressEnter(someNewText)

        viewmodel.expect.mockFunction(finalizeEditNode).toBeCalled()
        viewmodel.expect.mockFunction(finalizeEditNode).toBeCalledWith({
          id: childNode.id,
          text: someNewText,
        })

        function renderTestWithChildNodeInEditMode() {
          const {
            childNode,
            initialState,
          } = createInitialStateWithChildNodeInEditMode()
          const finalizeEditNode = viewmodel.create.mockFunction()
          renderTest({
            initialState,
            modifications: { finalizeEditNode },
          })

          return { childNode, finalizeEditNode }

          function createInitialStateWithChildNodeInEditMode() {
            const childNode = viewmodel.create.node({
              text: 'child',
              editing: true,
            })
            const rootNode = viewmodel.create.node({
              text: 'parent',
              children: [childNode],
            })
            const initialState = viewmodel.create.state({
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

        view.action.mouse.clickOn.node({ text: parentNode.text })
        view.action.mouse.editSelectedNode()

        viewmodel.expect.mockFunction(initiateEditNode).toBeCalled()
        viewmodel.expect
          .mockFunction(initiateEditNode)
          .toBeCalledWith(parentNode.id)

        function renderTestWithParentAndChildNode() {
          const {
            initialState,
            parentNode,
          } = createInitialStateWithParentAndChildNode()
          const initiateEditNode = viewmodel.create.mockFunction()

          renderTest({
            initialState,
            modifications: { initiateEditNode },
          })

          return { parentNode, initiateEditNode }

          function createInitialStateWithParentAndChildNode() {
            const childNode = viewmodel.create.node({ text: 'child' })
            const parentNode = viewmodel.create.node({
              text: 'parent',
              children: [childNode],
            })
            const initialState = viewmodel.create.state({
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
  const { rendered } = view.render({
    injectMockModelIntoJSX: ({ useMock }) => (
      <MainView useThisModel={useMock} />
    ),
    initialState,
    mockHookModifications: modifications,
  })

  return rendered
}
