import { MainView } from '~mindmap/components'
import { view, viewmodel, addIdTo } from '~mindmap/test-utilities'
import { render } from '@testing-library/react'
import React from 'react'

describe('new state structure', () => {
  test('single node', () => {
    const node = addIdTo({ text: 'one node' })
    render(<MainView nodes={[node]} />)
    view.expect.node(node).toBeVisible()
  })

  test('multiple nodes', () => {
    const nodes = ['a', 'b', 'c', 'd'].map((text) => addIdTo({ text }))
    render(<MainView nodes={nodes} />)
    nodes.forEach((node) => view.expect.node(node).toBeVisible())
  })

  // test('focus', () => {
  //   const nodeFocused = addIdTo({ text: 'focus this', focused: true })
  //   const nodeBlurred = addIdTo({ text: 'blurred' })
  //   render(<MainView nodes={[nodeFocused, nodeBlurred]} />)
  //   view.expect.node(nodeFocused).toHaveFocus()
  // })

  test('doubleclick on MindBoard to create node', () => {
    const createNode = viewmodel.create.mockFunction()
    render(<MainView nodes={[]} createNode={createNode} />)
    view.action.doubleClickOn.mindSpace()
    viewmodel.expect.mockFunction(createNode).toBeCalledTimes(1)
  })

  test('doubleclick on Node to start editing node', () => {
    const nodeToBeEdited = addIdTo({
      text: 'double click here',
      do: { startToEdit: viewmodel.create.mockFunction() },
    })
    render(<MainView nodes={[nodeToBeEdited]} />)
    view.action.doubleClickOn.node(nodeToBeEdited)
    viewmodel.expect
      .mockFunction(nodeToBeEdited.do.startToEdit)
      .toBeCalledTimes(1)
  })

  test('doubleclick on node does not create a node', () => {
    const node = addIdTo({ text: 'target', do: { startToEdit() {} } })
    const createNode = viewmodel.create.mockFunction()
    render(<MainView nodes={[node]} createNode={createNode} />)
    view.action.doubleClickOn.node(node)
    viewmodel.expect.mockFunction(createNode).toBeCalledTimes(0)
  })

  test('type and press enter to give node text when editing', () => {
    const nodeInEdit = addIdTo({
      text: '',
      editing: true,
      do: { changeNodeText: viewmodel.create.mockFunction() },
    })
    render(<MainView nodes={[nodeInEdit]} />)
    view.action.keyboard.typeAndPressEnter('new text')
    viewmodel.expect
      .mockFunction(nodeInEdit.do.changeNodeText)
      .nthCalledWith(1, 'new text')
  })
})
