import React, { createContext, createRef, useEffect, useReducer } from 'react'
import produce from 'immer'
import { v4 as uuidv4 } from 'uuid'
import { useTime } from '../../hooks/useTime'
import useResizeObserver from '@react-hook/resize-observer'

export const ProjectContext = createContext()

export function ProjectProvider({
  children,
  initialState = { trees: [], origin: { left: 100, top: 100 } },
  useThisResizeObserver = useResizeObserver,
  logResize = () => {},
}) {
  const newViewModel = useMainView({
    initialState,
    useThisResizeObserver,
    logResize,
  })

  return (
    <ProjectContext.Provider value={newViewModel}>
      {children}
    </ProjectContext.Provider>
  )
}

function useMainView({ initialState, useThisResizeObserver, logResize }) {
  const [state, dispatch] = useReducer(reduce, initialState)
  const { timeline, insertIntoTimeline, goBack, goForward } = useTime()

  useEffect(() => {
    insertIntoTimeline(state)
  }, [state])

  return {
    state: timeline.present,
    undo: goBack,
    redo: goForward,
    createRootNode() {
      dispatch({ type: 'CREATE_ROOT_NODE' })
    },
    createChildNode(parentId) {
      dispatch({ type: 'CREATE_CHILD_NODE', payload: parentId })
    },
    initiateEditNode(id) {
      dispatch({ type: 'EDIT_NODE', payload: { id, editing: true } })
    },
    finalizeEditNode(payload) {
      dispatch({ type: 'EDIT_NODE', payload: { ...payload, editing: false } })
    },
    foldNode(id) {
      dispatch({ type: 'TOGGLE_NODE_FOLD', payload: id })
    },
    replaceState(newState) {
      dispatch({ type: 'REPLACE_STATE', payload: newState })
    },
    updateNodeDimensions({ id, dimensions }) {
      dispatch({
        type: 'EDIT_NODE',
        payload: { id, dimensions },
      })
      logResize({ id, dimensions })
    },
    useThisResizeObserver,
  }

  function reduce(state, action) {
    const transition = stateTransitions[action.type]
    const newState = transition(state, action.payload)

    return newState
  }
}

const stateTransitions = {
  CREATE_ROOT_NODE(state) {
    return produce(state, (newState) => {
      const node = createNode()
      newState.trees.push(node)
    })
  },
  CREATE_CHILD_NODE(state, parentId) {
    return produce(state, (newState) => {
      const parentNode = getNode({ id: parentId, trees: newState.trees })
      if (!parentNode.children) parentNode.children = []

      const node = createNode()
      parentNode.children.push(node)
    })
  },
  EDIT_NODE(state, { id, ...modifications }) {
    return produce(state, (newState) => {
      modifyNode({ id, newState, modifications })
    })
  },
  TOGGLE_NODE_FOLD(state, id) {
    return produce(state, (newState) => {
      const node = getNode({ id, trees: newState.trees })
      node.folded = !node.folded
    })
  },
}

function getNode({ id, trees }) {
  if (trees.length === 0) return null

  const foundNode = trees.find((tree) => tree.id === id)
  if (foundNode) return foundNode

  return getNode({
    id,
    trees: trees
      .filter((tree) => tree.children?.length)
      .flatMap((tree) => tree.children),
  })
}

function modifyNode({ id, newState, modifications }) {
  const { trees, origin } = newState
  const node = getNode({ id, trees })

  Object.entries(modifications).forEach(([key, value]) => {
    if (key !== 'dimensions') node[key] = value
    else
      updateValuesRelatedToDimensions({
        node,
        dimensions: value,
        state: newState,
      })
  })

  function updateValuesRelatedToDimensions({ node, dimensions, state }) {
    node.dimensions = dimensions

    const parent = getParent({ state, node })
    const closestElderSibling = getClosestElderSibling({ state, node })

    const { desiredDimensions } = node
    const origin = getOrigin(state)

    const space = 10

    desiredDimensions.left = calculateLeft()
    desiredDimensions.top = calculateTop()
    desiredDimensions.inResponseTo = dimensions

    function calculateLeft() {
      if (closestElderSibling) return closestElderSibling.dimensions.left
      if (parent)
        return parent.dimensions.left + parent.dimensions.width + space
      return origin.left
    }

    function calculateTop() {
      if (closestElderSibling)
        return (
          closestElderSibling.dimensions.top +
          closestElderSibling.dimensions.height +
          space
        )
      if (parent) return parent.dimensions.top
      return origin.top
    }
  }

  function getOrigin(state) {
    return state.origin
  }
}

function getParent({ state, node: { id } }) {
  const rootNodes = getRootNodes(state)
  if (rootNodes.find((node) => node.id === id)) return

  return findParent({ id, nodes: rootNodes })

  function findParent({ id, nodes }) {
    const parent = nodes.find(({ children }) =>
      children?.find((child) => child.id === id)
    )

    if (parent) return parent
    return findParent({
      id,
      nodes: nodes
        .filter(({ children }) => children?.length)
        .flatMap(({ children }) => children),
    })
  }
}

function getClosestElderSibling({ state, node: { id } }) {
  const rootNodes = getRootNodes(state)

  return findClosestElderSibling({ id, nodes: rootNodes })

  function findClosestElderSibling({ id, nodes }) {
    const siblings = getSiblings({ id, nodes })

    if (siblings) return siblings.find((_, i) => siblings?.[i + 1]?.id === id)
    return
  }
}

function getSiblings({ id, nodes }) {
  const matchingNode = nodes.find((node) => node.id === id)

  if (matchingNode) return nodes

  for (const { children } of nodes) {
    if (children?.length) {
      const siblings = getSiblings({ id, nodes: children })
      if (siblings) return siblings
    }
  }
}

function getRootNodes(state) {
  return state.trees
}

function createNode() {
  return {
    id: uuidv4(),
    text: '',
    editing: true,
    dimensions: {},
    desiredDimensions: {},
  }
}
