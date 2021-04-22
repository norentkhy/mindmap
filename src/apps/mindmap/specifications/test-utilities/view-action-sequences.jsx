import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'
import React from 'react'

describe('utilities', () => {
  test('create a root node with properties', async () => {
    view.render({ JSX: <MindMapApp /> })

    const text = 'root node with properties'
    await view.actionSequence.createRootNodeWithProperties({ text })

    await view.waitFor.node({ text }).toBeVisible()
  })

  test('create a child node with properties', async () => {
    view.render({ JSX: <MindMapApp /> })
    let parentText = 'parent node'
    await view.actionSequence.createRootNodeWithProperties({
      text: parentText,
    })
    view.mouseAction.clickOn.node({ text: parentText })

    const text = 'child node with properties'
    await view.actionSequence.createChildNodeWithProperties({
      text,
    })

    await view.waitFor.node({ text }).toBeVisible()
  })

  describe('create a mindmap from tree datastructures', () => {
    const scenariosOfTrees = [
      [[]],
      [[getTreeOfOneRootNode({ id: 0 })]],
      [[getTreeOfOneRootNode({ id: 0 }), getTreeOfOneRootNode({ id: 1 })]],
      [[getTreeOfOneGrandFamily({ id: 0 })]],
    ]
    test.each(scenariosOfTrees)(
      'create a mindmap from tree datastructures',
      async (trees) => {
        view.render({ JSX: <MindMapApp /> })
        await view.actionSequence.createTrees(trees)
        expectTreesToBeVisible(trees)
      }
    )

    function getTreeOfOneRootNode({ id }) {
      return { text: `just one root node (id: ${id})` }
    }

    function getTreeOfOneGrandFamily({ id }) {
      const child = { text: `child (id: ${id})` }
      const parent = { text: `parent id(${id})`, children: [child] }
      return {
        text: `grandparent (id: ${id})`,
        children: [parent],
      }
    }
  })

  function expectTreesToBeVisible(trees) {
    trees?.forEach((tree) => {
      view.expect.node(tree).toBeVisible()
      expectTreesToBeVisible(tree.children)
    })
  }
})
