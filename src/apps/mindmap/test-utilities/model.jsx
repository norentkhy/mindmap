import { generateUUID } from './dependencies'
import { jest } from '@jest/globals'
import { createRef } from 'react'
import produce from 'immer'

export const model = {
  create: {
    node: createNode,
    state: createState,
    tab: createTab,
    mockFunction: jest.fn,
  },
  expect: {
    mockFunction: expectMockFunction,
  },
}

function createTab(
  { title = 'untitled', selected = false } = {
    title: 'untitled',
    selected: false,
  }
) {
  return { id: generateUUID(), title, selected }
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

function expectMockFunction(mockFn) {
  const expectSubject = expect(mockFn)
  return {
    toBeCalled: expectSubject.toBeCalled,
    toBeCalledTimes: expectSubject.toBeCalledTimes,
    toBeCalledWith: expectSubject.toBeCalledWith,
    nthCalledWith: expectSubject.nthCalledWith,
    not: {
      toBeCalled: expectSubject.not.toBeCalled,
      toBeCalledTimes: expectSubject.not.toBeCalledTimes,
      toBeCalledWith: expectSubject.not.toBeCalledWith,
      nthCalledWith: expectSubject.not.nthCalledWith,
    },
  }
}
