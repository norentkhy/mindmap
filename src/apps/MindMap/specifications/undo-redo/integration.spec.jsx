import MindMapApp from '~mindmap/App'
import { queryNodeInput } from '~mindmap/components/MainView/testUtilities'
import { createRootNodeWithProperties } from '~mindmap/MindMapTestUtilities'

import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import 'jest-styled-components'

describe('undo/redo', () => {
  test('creation of rootnode', async () => {
    render(<MindMapApp />)

    const rootNode = { text: 'root node' }

    const RootNode = await createRootNodeWithProperties(rootNode)
    expect(RootNode).toBeVisible()

    const UndoActionButton = screen.getByLabelText('undo action')
    fireEvent.click(UndoActionButton)
    await waitFor(() => expect(screen.queryByText(rootNode.text)).toBeNull())
    expect(queryNodeInput()).toBeVisible()
    expect(queryNodeInput()).toHaveFocus()

    const EmptyScreen = screen
    fireEvent.click(UndoActionButton)
    expect(screen).toEqual(EmptyScreen)

    fireEvent.click(UndoActionButton)
    await waitFor(() => expect(screen.queryByText(rootNode.text)).toBeNull())

    const RedoActionButton = screen.getByLabelText('redo action')
    fireEvent.click(RedoActionButton)
    await waitFor(() => expect(queryNodeInput()).toBeVisible)

    fireEvent.click(RedoActionButton)
    await waitFor(() => expect(screen.getByText(rootNode.text)).toBeVisible)

    const NonEmptyScreen = screen
    fireEvent.click(RedoActionButton)
    expect(screen).toEqual(NonEmptyScreen)
  })
})
