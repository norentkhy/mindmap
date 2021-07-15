import { MainView } from 'src/components'
import {
  view,
  createMockFn,
  addIdTo,
  describe,
  test,
  expect,
} from 'src/test-utils'
import React from 'react'

describe('new state structure', () => {
  test('single node', () => {
    const node = addIdTo({ text: 'one node' })
    view.render(<MainView nodes={[node]} />)
    view.expect.node(node).toBeVisible()
  })

  test('multiple nodes', () => {
    const nodes = ['a', 'b', 'c', 'd'].map((text) => addIdTo({ text }))
    view.render(<MainView nodes={nodes} />)
    nodes.forEach((node) => view.expect.node(node).toBeVisible())
  })

  // test('focus', () => {
  //   const nodeFocused = addIdTo({ text: 'focus this', focused: true })
  //   const nodeBlurred = addIdTo({ text: 'blurred' })
  //   view.render(<MainView nodes={[nodeFocused, nodeBlurred]} />)
  //   view.expect.node(nodeFocused).toHaveFocus()
  // })

  test('doubleclick on MindBoard to create node', () => {
    const createNode = createMockFn()
    view.render(<MainView nodes={[]} createNode={createNode} />)
    view.doubleClickOn.mindSpace()
    expect(createNode).toBeCalledTimes(1)
  })

  test('doubleclick on Node to start editing node', () => {
    const nodeToBeEdited = addIdTo({
      text: 'double click here',
      do: { startToEdit: createMockFn() },
    })
    view.render(<MainView nodes={[nodeToBeEdited]} />)
    view.doubleClickOn.node(nodeToBeEdited)
    expect(nodeToBeEdited.do.startToEdit).toBeCalledTimes(1)
  })

  test('doubleclick on node does not create a node', () => {
    const node = addIdTo({ text: 'target', do: { startToEdit() {} } })
    const createNode = createMockFn()
    view.render(<MainView nodes={[node]} createNode={createNode} />)
    view.doubleClickOn.node(node)
    expect(createNode).toBeCalledTimes(0)
  })

  test('type and press enter to give node text when editing', () => {
    const nodeInEdit = addIdTo({
      text: '',
      editing: true,
      focused: true,
      do: { changeNodeText: createMockFn() },
    })
    view.render(<MainView nodes={[nodeInEdit]} />)
    view.withKeyboard('type', 'new text')
    view.withKeyboard('press', 'enter')
    expect(nodeInEdit.do.changeNodeText).nthCalledWith(1, 'new text')
  })

  test('press shift+enter to write on a new line', () => {
    const nodeInEdit = addIdTo({
      text: '',
      editing: true,
      focused: true,
      do: { changeNodeText: createMockFn() },
    })
    view.render(<MainView nodes={[nodeInEdit]} />)
    view.withKeyboard('type', 'line 1')
    view.withKeyboard('press', ['shift', 'enter'])
    expect(nodeInEdit.do.changeNodeText).toBeCalledTimes(0)

    view.withKeyboard('type', 'line 2')
    view.withKeyboard('press', 'enter')
    expect(nodeInEdit.do.changeNodeText).nthCalledWith(1, 'line 1\nline 2')
  })
})
