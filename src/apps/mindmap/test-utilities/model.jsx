import { generateUUID } from './dependencies'
import { createRef } from 'react'
import produce from 'immer'

export const model = {
  create: {
    node: createNode,
    state: createState,
    tab: createTab,
  },
}

function createTab() {
  return { id: generateUUID(), title: 'untitled' }
}

function createNode({
  text,
  editing = false,
  folded = false,
  children = [],
  desiredTreeCss,
  ...unknownProperties
}) {
  const unknownPropertyKeys = Object.keys(unknownProperties)
  if (unknownPropertyKeys.length)
    throw new Error(`unknown properties: ${unknownPropertyKeys}`)

  return {
    id: generateUUID(),
    ref: createRef(),
    text,
    editing,
    folded,
    children,
    desiredTreeCss,
  }
}

function createState({ rootNodes }) {
  return { trees: rootNodes }
}
