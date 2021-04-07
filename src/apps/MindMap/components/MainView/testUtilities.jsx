import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function queryNodeInput() {
  return screen.queryByLabelText('editing node')
}

export function foldNode(Node) {
  userEvent.type(Node, 'f')
}

export function queryNode({ text }) {
  return screen.queryByText(text)
}

export const ui = {
  selectNode({ text }) {
    const Target = queryNode({ text })
    userEvent.click(Target)
  },
  foldSelectedNode() {
    const Target = getFocus()
    userEvent.type(Target, 'f')
  },
  createChildNodeOfSelectedNode() {
    const Target = getFocus()
    userEvent.type(Target, 'c')
  },
  createRootNode() {
    fireEvent.doubleClick(screen.getByLabelText('main view'))
  },
  typeAndPressEnter(text) {
    const Target = getFocus()
    userEvent.type(Target, `${text}{enter}`)
  },
  editSelectedNode() {
    const Target = getFocus()
    userEvent.type(Target, '{enter}')
  },
}

export function getFocus() {
  return document.activeElement || document.body
}

export const createDataStructure = {
  node({
    text,
    editing = false,
    folded = false,
    children = [],
    desiredDimensions = {},
    processResizeEvent,
  }) {
    return {
      id: createUuid(),
      ref: createRef(),
      text,
      editing,
      folded,
      children,
      processResizeEvent,
      desiredDimensions,
    }
  },
  childNode({ parentNode, text }) {
    return produce(parentNode, (node) => {
      if (!node?.children?.length) node.children = []
      node.children.push({ id: createUuid(), text })
    })
  },
  state({ rootNodes }) {
    return { trees: rootNodes }
  },
}

function createUuid() {
  return uuidv4()
}
