import React from 'react'
import { render, screen } from '@testing-library/react'
import { MainView } from './MainView'
import { v4 as uuidv4 } from 'uuid'
import { getInputSelection } from 'test-utils/dom'
import {
  createDataStructure,
  queryNode,
  queryNodeInput,
  ui,
  getFocus,
} from './testUtilities'
import { createMockContextProvider } from 'test-utils/react-mocks'
import 'jest-styled-components'

describe('inherited from MindMap.spec', () => {
  test('label', () => {
    renderTest()
    screen.getByLabelText(/^main view$/i)
  })
})

describe('main view contents', () => {
  describe('display of various nodes', () => {
    test('display of root node', () => {
      const node = renderWithOneRootNode()
      expect(queryNode({ text: node.text })).toBeVisible()

      function renderWithOneRootNode() {
        const node = createDataStructure.node({ text: 'original text' })
        const initialState = createDataStructure.state({ rootNodes: [node] })
        renderTest({ initialState })

        return node
      }
    })

    test('display of multiple root nodes', () => {
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

  describe('root node creation', () => {
    test('creation of a root node', () => {
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

    test('naming of a created root node', () => {
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
          const initialState = createDataStructure.state({ rootNodes: [node] })
          return { node, initialState }
        }
      }
    })
  })

  describe('child node creation', () => {
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

  test('edit text of a node', () => {
    const { parentNode, initiateEditNode } = renderTestWithParentAndChildNode()

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

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  const [MockContext, MockProvider] = createMockContextProvider({
    initialState,
    modifications: {
      useThisResizeObserver() {},
      registerNodeLayout() {},
      registerTreeLayout() {},
      adjustRootTree() {},
      ...modifications,
    },
  })

  return render(
    <MockProvider>
      <MainView theProjectContext={MockContext} />
    </MockProvider>
  )
}
