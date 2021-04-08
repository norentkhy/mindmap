import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MindMap from './MindMap'
import userEvent from '@testing-library/user-event'
import { queryNodeInput } from './components/MainView/testUtilities'
import {
  createRootNode,
  completeNodeNaming,
  createRootNodeWithProperties,
  createChildNode,
  queryNode,
  findNodeInput,
} from './MindMapTestUtilities'
import 'jest-styled-components'

const spy = jest.spyOn(global.console, 'error')
afterEach(() => expect(spy).not.toHaveBeenCalled())

describe('view elements', () => {
  test('tabs', () => {
    render(<MindMap />)
    screen.getByLabelText(/^tabs$/i)
  })

  test('actions', () => {
    render(<MindMap />)
    screen.getByLabelText(/^actions$/i)
  })

  test('main view', () => {
    render(<MindMap />)
    screen.getByLabelText(/^main view$/i)
  })
})

describe('tabs integration', () => {
  test('add a new tab', () => {
    render(<MindMap />)
    expect(screen.queryByText('untitled')).toBeNull()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getByText('untitled')).toBeVisible()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getAllByText('untitled').length).toBe(2)
  })

  test('rename a tab', () => {
    render(<MindMap />)
    fireEvent.click(screen.getByLabelText('add new tab'))
    fireEvent.doubleClick(screen.getByText('untitled'))

    const someNewTitle = 'some new title'
    userEvent.type(document.activeElement, someNewTitle)
    userEvent.type(document.activeElement, '{enter}')

    expect(screen.getByText(someNewTitle)).toBeVisible()
  })
})

describe('main view integration', () => {
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
