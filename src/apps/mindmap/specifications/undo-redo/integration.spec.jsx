import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import { createRootNodeWithProperties } from '~mindmap/test-utilities/integrated-view'

import React from 'react'
import { screen } from '@testing-library/react'

describe('undo/redo', () => {
  test('creation of rootnode', async () => {
    ui.render(<MindMapApp />)

    const rootNode = { text: 'root node' }

    await createRootNodeWithProperties(rootNode)
    ui.expect.node(rootNode).toBeVisible()

    ui.mouseAction.clickOn.menu.undoAction()
    await ui.waitFor.nodeInput().toHaveFocus()

    const EmptyScreen = screen
    ui.mouseAction.clickOn.menu.undoAction()
    expect(screen).toEqual(EmptyScreen)

    ui.mouseAction.clickOn.menu.undoAction()
    await ui.waitFor.node(rootNode).not.toBeVisible()

    ui.mouseAction.clickOn.menu.redoAction()
    await ui.waitFor.nodeInput().toBeVisible()

    ui.mouseAction.clickOn.menu.redoAction()
    await ui.waitFor.node(rootNode).toBeVisible()

    const NonEmptyScreen = screen
    ui.mouseAction.clickOn.menu.redoAction()
    expect(screen).toEqual(NonEmptyScreen)
    expect(screen).toEqual(EmptyScreen)
  })
})
