import { ModelContext, ModelProvider } from '~mindmap/components'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { useContext } from 'react'

export function captureNewNodes({ result, change }) {
  const oldNodes = getRootNodes(result)
  change()
  const nodes = getRootNodes(result)

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
export function createRootNodeWithProperties(result, { text, ...others }) {
  act(() => result.current.createRootNode())
  const { id } = getNewestRootNode(result)
  act(() => result.current.finalizeEditNode({ id, text, ...others }))
  return id
}
export function createChildNodeWithProperties({
  result,
  parentId,
  properties: { text, ...others },
}) {
  const newNodes = captureNewNodes({
    result,
    change: () => {
      act(() => result.current.createChildNode(parentId))
    },
  })
  const { id } = newNodes[0]
  act(() => result.current.finalizeEditNode({ id, text, ...others }))
  return id
}
export function getRootNodes(result) {
  const state = getState(result)
  return state.trees
}
export function getNewestRootNode(result) {
  const rootNodes = getRootNodes(result)
  return rootNodes[rootNodes.length - 1]
}
export function getState(result) {
  return result.current.state
}
export function getTrees(result) {
  return getState(result).trees
}

export function getNode({ result, id }) {
  const nodes = getRootNodes(result)

  return findNode({ nodes, id })

  function findNode({ nodes, id }) {
    const foundNode = nodes.find((node) => node.id === id)
    if (foundNode) return foundNode

    return findNode({ nodes: nodes.flatMap(({ children }) => children), id })
  }
}

export function renderHookTest(log) {
  const { useMockResizeObserver } = createMockResizeObserverHook()

  return renderHook(() => useContext(ModelContext), {
    wrapper: ({ children }) => (
      <ModelProvider
        useThisResizeObserver={useMockResizeObserver}
        logResize={log}
      >
        {children}
      </ModelProvider>
    ),
  })
}
