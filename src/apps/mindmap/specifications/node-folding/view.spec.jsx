import { MainView } from '~mindmap/components'
import { ui, model } from '~mindmap/test-utilities'
import React from 'react'

describe('node folding: view', () => {
  test('display a folded node', () => {
    const { invisibleNode, foldedNode } = renderFoldedNodeWithInvisibleNode()

    ui.expect.node(foldedNode).toBeVisible()
    ui.expect.node(invisibleNode).not.toBeVisible()

    function renderFoldedNodeWithInvisibleNode() {
      const {
        initialState,
        rootNode: foldedNode,
        childNode: invisibleNode,
      } = createInitialStateWithRootAndChildNode()
      renderTest({ initialState })

      return { invisibleNode, foldedNode }

      function createInitialStateWithRootAndChildNode() {
        const childNode = model.create.node({ text: 'folded away' })
        const rootNode = model.create.node({
          text: 'fold this',
          folded: true,
          children: [childNode],
        })
        const initialState = model.create.state({
          rootNodes: [rootNode],
        })

        return { initialState, rootNode, childNode }
      }
    }
  })

  test('fold call to view model', () => {
    const { nodeToFold, foldNode } = renderNodeToFold()

    ui.mouseAction.clickOn.node({ text: nodeToFold.text })
    ui.keyboardAction.foldSelectedNode()

    expect(foldNode).toHaveBeenCalled()
    expect(foldNode).toBeCalledWith(nodeToFold.id)

    function renderNodeToFold() {
      const { rootNode, initialState } = createInitialStateWithRootNode()
      const foldNode = jest.fn()

      renderTest({
        initialState,
        modifications: { foldNode },
      })

      return { nodeToFold: rootNode, foldNode }

      function createInitialStateWithRootNode() {
        const rootNode = model.create.node({ text: 'fold this' })
        const initialState = model.create.state({
          rootNodes: [rootNode],
        })

        return { rootNode, initialState }
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
  const { rendered } = ui.renderView({
    injectMockModelIntoJSX: ({ useMock }) => (
      <MainView useThisModel={useMock} />
    ),
    initialState,
    mockHookModifications: modifications,
  })

  return rendered
}
