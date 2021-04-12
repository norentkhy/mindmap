import MindMap from '~mindmap/MindMap'
import {
  createRootNode,
  completeNodeNaming,
  createRootNodeWithProperties,
  createChildNode,
  queryNode,
  findNodeInput,
} from '~mindmap/MindMapTestUtilities'
import { queryNodeInput } from '~mindmap/components/MainView/testUtilities'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import 'jest-styled-components'

describe('node creation: integration', () => {
  test('create a rootnode and edit its content', async () => {
    render(<MindMap />)

    createRootNode()

    const InputNode = queryNodeInput()
    expect(InputNode).toBeVisible()
    expect(InputNode).toHaveFocus()

    const someNewText = 'some new text'
    await completeNodeNaming(someNewText)

    await waitFor(() => expect(queryNodeInput()).toBeNull())
    expect(screen.getByText(someNewText)).toBeVisible()
  })

  test('create multiple rootnodes', async () => {
    render(<MindMap />)

    const rootTexts = ['root node 1', 'root node 2']
    for (const text of rootTexts) {
      await createRootNodeWithProperties({ text })
      const CreatedNode = await screen.findByText(text)
      expect(CreatedNode).toBeVisible()
    }
  })

  test('create a childnode', async () => {
    render(<MindMap />)
    const rootText = 'root text'
    await createRootNodeWithProperties({ text: rootText })

    const ParentNode = screen.getByText(rootText)
    createChildNode(ParentNode)
    const ChildInput = await findNodeInput()
    expect(ChildInput).toBeVisible()
    await waitFor(() => {
      expect(ChildInput).toHaveFocus()
    })

    const childText = 'child text'
    await completeNodeNaming(childText)

    expect(queryNodeInput()).toBeNull()
    ;[rootText, childText].forEach((text) => {
      expect(screen.getByText(text)).toBeVisible()
    })
  })

  test('editing node text', async () => {
    render(<MindMap />)
    const rootNode = { text: 'root node' }
    const RootNode = await createRootNodeWithProperties(rootNode)

    userEvent.type(RootNode, '{enter}')
    const NodeInput = await findNodeInput()
    expect(NodeInput).toBeVisible()
    await waitFor(() => {
      expect(NodeInput).toHaveFocus()
    })

    const newText = 'some new text'
    userEvent.type(NodeInput, newText)
    userEvent.type(NodeInput, '{enter}')
    expect(queryNode({ text: newText }))
  })
})
