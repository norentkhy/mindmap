import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'

import React from 'react'
import { screen } from '@testing-library/react'

describe('undo/redo', () => {
  test('creation of rootnode', async () => {
    view.render({ JSX: <MindMapApp /> })

    const rootNode = { text: 'root node' }

    await view.actionSequence.createRootNodeWithProperties(rootNode)
    view.expect.node(rootNode).toBeVisible()

    view.mouseAction.clickOn.menu.undoAction()
    await view.waitFor.nodeInput().toHaveFocus()

    const EmptyScreen = screen
    view.mouseAction.clickOn.menu.undoAction()
    expect(screen).toEqual(EmptyScreen)

    view.mouseAction.clickOn.menu.undoAction()
    await view.waitFor.node(rootNode).not.toBeVisible()

    view.mouseAction.clickOn.menu.redoAction()
    await view.waitFor.nodeInput().toBeVisible()

    view.mouseAction.clickOn.menu.redoAction()
    await view.waitFor.node(rootNode).toBeVisible()

    const NonEmptyScreen = screen
    view.mouseAction.clickOn.menu.redoAction()
    expect(screen).toEqual(NonEmptyScreen)
    expect(screen).toEqual(EmptyScreen)
  })
})
