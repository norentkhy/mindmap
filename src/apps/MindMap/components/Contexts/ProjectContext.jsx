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
    registerNodeLayout({ id, boundingClientRect, offsetRect }) {
      dispatch({
        type: 'EDIT_NODE',
        payload: { id, measuredNode: { boundingClientRect, offsetRect } },
      })
      logResize({ id, boundingClientRect, offsetRect })
    },
    registerTreeLayout({ id, boundingClientRect, offsetRect }) {
      dispatch({
        type: 'EDIT_NODE',
        payload: { id, measuredTree: { boundingClientRect, offsetRect } },
      })
    },
    registerSurfaceLayout({ boundingClientRect, offsetRect }) {
      dispatch({
        type: 'EDIT_STATE',
        payload: { measuredSurface: { boundingClientRect, offsetRect } },
      })
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
  EDIT_STATE(state, newProps) {
    return produce(state, (newState) => {
      const keyValues = Object.entries(newProps)
      keyValues.forEach(([key, value]) => {
        newState[key] = value
      })
    })
  },
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
  const { trees } = newState
  const node = getNode({ id, trees })

  Object.entries(modifications).forEach(([key, value]) => {
    node[key] = value
  })
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
