import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'
import { createTrees } from '~mindmap/test-utilities/integrated-view'
import React from 'react'

describe('node folding: integration', () => {
  test('fold a node structure', async () => {
    view.render({ JSX: <MindMapApp /> })
    const texts = [
      {
        parent: 'unaffected1',
        child: 'fold this1',
        grandchild: 'folded away1',
      },
      {
        parent: 'unaffected2',
        child: 'fold this2',
        grandchild: 'folded away2',
      },
    ]
    const trees = texts.map(generateFoldTree)
    await createTrees(trees)

    for (const text of texts) {
      view.expect.node({ text: text.grandchild }).toBeVisible()

      view.mouseAction.clickOn.node({ text: text.child })
      view.keyboardAction.foldSelectedNode()
      await view.waitFor.node({ text: text.grandchild }).not.toBeVisible()

      view.mouseAction.clickOn.node({ text: text.child })
      view.keyboardAction.foldSelectedNode()
      await view.waitFor.node({ text: text.grandchild }).toBeVisible()
    }

    function generateFoldTree({ parent, child, grandchild }) {
      return {
        text: parent,
        children: [{ text: child, children: [{ text: grandchild }] }],
      }
    }
  })
})
