import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'

import React from 'react'
import { screen } from '@testing-library/react'

describe('undo/redo', () => {
  test('creation of rootnode', async () => {
    view.render({ JSX: <MindMapApp /> })

    const rootNode = { text: 'root node' }

    await view.action.sequence.createRootNodeWithProperties(rootNode)
    view.expect.node(rootNode).toBeVisible()

    view.action.mouse.clickOn.menu.undoAction()
    await view.waitFor.nodeInput().toHaveFocus()

    const EmptyScreen = screen
    view.action.mouse.clickOn.menu.undoAction()
    expect(screen).toEqual(EmptyScreen)

    view.action.mouse.clickOn.menu.undoAction()
    await view.waitFor.node(rootNode).not.toBeVisible()

    view.action.mouse.clickOn.menu.redoAction()
    await view.waitFor.nodeInput().toBeVisible()

    view.action.mouse.clickOn.menu.redoAction()
    await view.waitFor.node(rootNode).toBeVisible()

    const NonEmptyScreen = screen
    view.action.mouse.clickOn.menu.redoAction()
    expect(screen).toEqual(NonEmptyScreen)
    expect(screen).toEqual(EmptyScreen)
  })
})
