import { generateUUID } from './dependencies'
import { useModel } from '~mindmap/hooks'
import { ModelProvider } from '~mindmap/components'
import { mapObject } from 'utils/FunctionalProgramming'
import { act, renderHook } from '@testing-library/react-hooks'
import { jest } from '@jest/globals'
import React from 'react'
import Collection from '../data-structures/collection'

export const viewmodel = {
  render: renderModel,
  create: {
    node: createNode,
    state: createState,
    tab: createTab,
    mockFunction: jest.fn,
  },
  expect: {
    mockFunction: expectMockFunction,
    anId: expectAnId,
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
  shouldFocus = false,
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
    text,
    editing,
    shouldFocus,
    folded,
    children,
    desiredTreeCss,
  }
}

function createState({ rootNodes }) {
  const [nodes, arrows, user] = createCollectionsFromOldNodes(rootNodes)
  return { trees: rootNodes, nodes, arrows, user }
}

function createCollectionsFromOldNodes(oldNodes) {
  const initialNodes = Collection.create()
  const initialArrows = Collection.create()
  const user = { editingNodes: [], foldedNodes: [] }
  return addOldNodesToCollections(oldNodes, [initialNodes, initialArrows, user])
}

function addOldNodesToCollections(oldNodes, [nodes, arrows, user], parentId) {
  if (!oldNodes || oldNodes.length === 0) return [nodes, arrows, user]

  return oldNodes.reduce(
    ([nodes, arrows, user], oldNode) => {
      const { editing, folded, shouldFocus, ...node } = oldNode
      const [newNodes, id] = Collection.add(nodes, node)
      const newArrows = parentId
        ? Collection.replace(arrows, parentId, id)
        : arrows
      if (editing) user.editingNodes.push(id)
      if (folded) user.foldedNodes.push(id)
      if (shouldFocus) user.focusedNode = id

      return addOldNodesToCollections(
        node?.children,
        [newNodes, newArrows, user],
        id
      )
    },
    [nodes, arrows, user]
  )
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

function expectAnId() {
  return expect.any(String)
}

function renderModel(
  {
    useThisModel = useModel,
    wrapParents = ({ children, extraModelProviderProps }) => (
      <ModelProvider
        useThisResizeObserver={() => {}}
        logResize={() => {}}
        {...extraModelProviderProps}
      >
        {children}
      </ModelProvider>
    ),
    extraModelProviderProps = {},
  } = {
    useThisModel: useModel,
    wrapParents: ({ children, extraModelProviderProps }) => (
      <ModelProvider
        useThisResizeObserver={() => {}}
        logResize={() => {}}
        {...extraModelProviderProps}
      >
        {children}
      </ModelProvider>
    ),
    extraModelProviderProps: {},
  }
) {
  const wrapper = ({ children }) =>
    wrapParents({ children, extraModelProviderProps })
  const { result } = renderHook(useThisModel, { wrapper })

  if (useThisModel !== useModel)
    return { state: { getState }, actions: getActions() }

  return {
    state: getStateInfo(),
    action: getActions(),
    actionSequence: getActionSequences(),
    stateObservation: getStateObservationMethods(),
  }

  function getStateInfo() {
    return { getState, getRootNodes, getNode, getNewestRootNode }
  }

  function getState() {
    return result.current.state
  }

  function getRootNodes() {
    return getState().trees
  }

  function getNewestRootNode() {
    const rootNodes = getRootNodes()
    return rootNodes[rootNodes.length - 1]
  }

  function getNode(id) {
    const nodes = getRootNodes()

    return findNode({ nodes, id })

    function findNode({ nodes, id }) {
      const foundNode = nodes.find((node) => node.id === id)
      if (foundNode) return foundNode

      return findNode({ nodes: nodes.flatMap(({ children }) => children), id })
    }
  }

  function getActions() {
    const { state, ...actions } = result.current
    return mapObject(actions, wrapActAround)
  }

  function getActionSequences() {
    const { createRootNode, finalizeEditNode, createChildNode } = getActions()
    return {
      createRootNodeWithProperties({ id, text, ...others }) {
        createRootNode()
        const node = getNewestRootNode(result)
        finalizeEditNode({ id: node.id, text, ...others })
        return node
      },
      createChildNodeWithProperties({
        parentId,
        properties: { text, ...others },
      }) {
        const newNodes = captureNewNodes(() => createChildNode({ parentId }))
        const node = newNodes[0]
        finalizeEditNode({ id: node.id, text, ...others })
        return node
      },
    }
  }

  function getNewestRootNode() {
    const rootNodes = getRootNodes()
    return rootNodes[rootNodes.length - 1]
  }

  function getStateObservationMethods() {
    return { captureNewNodes }
  }

  function captureNewNodes(change) {
    const oldNodes = getRootNodes()
    change()
    const nodes = getRootNodes()

    const newNodes = getNewNodes({ oldNodes, nodes })

    return newNodes

    function getNewNodes({ oldNodes, nodes }) {
      const oldIds = getIds(oldNodes)
      const ids = getIds(nodes)
      const newIds = ids.filter((id) => !oldIds.includes(id))

      const newNodes = newIds.map((id) => getNode({ id, nodes }))

      return newNodes

      function getIds(nodes) {
        return nodes.flatMap(({ children, id }) => {
          if (!children) return id

          return [id, ...getIds(children)]
        })
      }

      function getNode({ id, nodes }) {
        if (nodes.length === 0) return null

        const foundNode = nodes.find((node) => node.id === id)
        if (foundNode) return foundNode

        const childNodes = nodes.reduce((childNodes, { children }) => {
          if (!children || children.length === 0) return childNodes
          return [...childNodes, ...children]
        }, [])
        return getNode({ id, nodes: childNodes })
      }
    }
  }
}

function wrapActAround(handleAction) {
  return (...args) => act(() => handleAction(...args))
}
