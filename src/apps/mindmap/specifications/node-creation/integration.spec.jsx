import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'
import 'jest-styled-components'

describe('node creation: integration', () => {
  test('create a rootnode and edit its content', async () => {
    ui.render(<MindMapApp />)

    const someNewText = 'some new text'
    ui.mouseAction.createRootNode()
    ui.keyboardAction.typeAndPressEnter(someNewText)

    await ui.waitFor.node({ text: someNewText }).toBeVisible()
  })

  test('create multiple rootnodes', async () => {
    ui.render(<MindMapApp />)

    const rootTexts = ['root node 1', 'root node 2']
    for (const text of rootTexts) {
      ui.mouseAction.createRootNode()
      ui.keyboardAction.typeAndPressEnter(text)

      await ui.waitFor.node({ text }).toBeVisible()
    }
  })

  test('create a childnode', async () => {
    ui.render(<MindMapApp />)
    const rootText = 'root text'

    ui.mouseAction.createRootNode()
    ui.keyboardAction.typeAndPressEnter(rootText)

    await ui.waitFor.node({ text: rootText }).toBeVisible()
    ui.mouseAction.clickOn.node({ text: rootText })
    ui.keyboardAction.createChildNodeOfSelectedNode()

    const childText = 'child text'
    await ui.waitFor.nodeInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter(childText)

    await ui.waitFor.nodeInput().not.toBeVisible()
    await ui.waitFor.node({ text: rootText }).toBeVisible()
    await ui.waitFor.node({ text: childText }).toBeVisible()
  })

  test('editing node text', async () => {
    ui.render(<MindMapApp />)

    const rootNode = { text: 'root node' }
    ui.mouseAction.createRootNode()
    ui.keyboardAction.typeAndPressEnter(rootNode.text)

    await ui.waitFor.nodeInput().not.toBeVisible()
    ui.mouseAction.clickOn.node(rootNode)
    ui.mouseAction.editSelectedNode()

    const newText = 'some new text'
    await ui.waitFor.nodeInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter(newText)
    await ui.waitFor.node({ text: newText }).toBeVisible()
  })
})
