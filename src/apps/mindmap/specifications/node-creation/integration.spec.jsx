import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'
import React from 'react'

describe('node creation: integration', () => {
  test('create a rootnode and edit its content', async () => {
    view.render({ JSX: <MindMapApp /> })

    const someNewText = 'some new text'
    view.action.mouse.createRootNode()
    view.action.keyboard.typeAndPressEnter(someNewText)

    await view.waitFor.node({ text: someNewText }).toBeVisible()
  })

  test('create multiple rootnodes', async () => {
    view.render({ JSX: <MindMapApp /> })

    const rootTexts = ['root node 1', 'root node 2']
    for (const text of rootTexts) {
      view.action.mouse.createRootNode()
      view.action.keyboard.typeAndPressEnter(text)

      await view.waitFor.node({ text }).toBeVisible()
    }
  })

  test('create a childnode', async () => {
    view.render({ JSX: <MindMapApp /> })
    const rootText = 'root text'

    view.action.mouse.createRootNode()
    view.action.keyboard.typeAndPressEnter(rootText)

    await view.waitFor.node({ text: rootText }).toBeVisible()
    view.action.mouse.clickOn.node({ text: rootText })
    view.action.keyboard.createChildNodeOfSelectedNode()

    const childText = 'child text'
    await view.waitFor.nodeInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter(childText)

    await view.waitFor.nodeInput().not.toBeVisible()
    await view.waitFor.node({ text: rootText }).toBeVisible()
    await view.waitFor.node({ text: childText }).toBeVisible()
  })

  test('editing node text', async () => {
    view.render({ JSX: <MindMapApp /> })

    const rootNode = { text: 'root node' }
    view.action.mouse.createRootNode()
    view.action.keyboard.typeAndPressEnter(rootNode.text)

    await view.waitFor.nodeInput().not.toBeVisible()
    view.action.mouse.clickOn.node(rootNode)
    view.action.mouse.editSelectedNode()

    const newText = 'some new text'
    await view.waitFor.nodeInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter(newText)
    await view.waitFor.node({ text: newText }).toBeVisible()
  })
})
