import React, { createContext, useEffect, useReducer } from 'react'
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
        type: 'REGISTER_NODE_LAYOUT',
        payload: { id, boundingClientRect, offsetRect },
      })
      logResize({ id, boundingClientRect, offsetRect })
    },
    registerTreeLayout({ id, boundingClientRect, offsetRect }) {
      dispatch({
        type: 'REGISTER_TREE_LAYOUT',
        payload: { id, boundingClientRect, offsetRect },
      })
    },
    registerSurfaceLayout({ boundingClientRect, offsetRect }) {
      dispatch({
        type: 'REGISTER_SURFACE_LAYOUT',
        payload: { boundingClientRect, offsetRect },
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

      const node = createNode(parentNode)
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
  REGISTER_SURFACE_LAYOUT(state, { boundingClientRect, offsetRect }) {
    return produce(state, (newState) => {
      newState.measuredSurface = { boundingClientRect, offsetRect }

      const rootNodes = getRootNodes(newState)
      rootNodes.forEach(({ id }) =>
        updateTreeOffset({ draftState: newState, id })
      )
    })
  },
  REGISTER_TREE_LAYOUT(state, { id, boundingClientRect, offsetRect }) {
    return produce(state, (newState) => {
      modifyNode({
        id,
        newState,
        modifications: { measuredTree: { boundingClientRect, offsetRect } },
      })

      updateTreeOffset({ draftState: newState, id })
    })
  },
  REGISTER_NODE_LAYOUT(state, { id, boundingClientRect, offsetRect }) {
    return produce(state, (newState) => {
      modifyNode({
        id,
        newState,
        modifications: { measuredNode: { boundingClientRect, offsetRect } },
      })

      updateTreeOffset({ draftState: newState, id })
    })
  },
}

function throwIfObjectValue({ object, evaluate, errorMessage = 'oops' }) {
  Object.values(object).forEach((value) => {
    if (evaluate(value)) throw new Error(errorMessage)
  })
}

function updateTreeOffset({ draftState, id }) {
  const { measuredSurface } = draftState
  const node = getNode({
    id,
    trees: getRootNodes(draftState),
  })

  if (canUpdate({ measuredSurface, node })) {
    if (!node.desiredTreeCss) node.desiredTreeCss = {}
    const desiredOffsets = computeDesiredOffsets({ measuredSurface, node })
    throwIfObjectValue({
      object: desiredOffsets,
      errorMessage: 'found NaN value',
      evaluate: isNaN,
    })
    modifyObject({
      target: node.desiredTreeCss,
      modifications: desiredOffsets,
    })
  }

  function canUpdate({
    measuredSurface,
    node: { measuredTree, measuredNode, parent },
  }) {
    return measuredSurface && measuredTree && measuredNode && !parent
  }

  function computeDesiredOffsets({
    measuredSurface,
    node: { measuredTree, measuredNode },
  }) {
    const surfaceCenter = getBoundingCenter(measuredSurface)
    const nodeCenter = getBoundingCenter(measuredNode)
    const nodeDistance = calculateDistance({ surfaceCenter, nodeCenter })

    return {
      offsetLeft: measuredTree.offsetRect.left + nodeDistance.left,
      offsetTop: measuredTree.offsetRect.top + nodeDistance.top,
    }

    function getBoundingCenter({
      boundingClientRect: { left, top, width, height },
    }) {
      return { left: left + width / 2, top: top + height / 2 }
    }

    function calculateDistance({ surfaceCenter, nodeCenter }) {
      return {
        left: surfaceCenter.left - nodeCenter.left,
        top: surfaceCenter.top - nodeCenter.top,
      }
    }
  }
}

function getRootNodes(state) {
  return state.trees
}

function getNode({ id, trees, state }) {
  if (!trees) trees = getRootNodes(state)
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
  modifyObject({
    target: getNode({ id, state: newState }),
    modifications,
  })
}

function modifyObject({ target, modifications }) {
  Object.entries(modifications).forEach(([key, value]) => {
    target[key] = value
  })
}

function createNode(parent) {
  const customInitialProperties = {
    id: uuidv4(),
    parent,
  }
  return {
    text: '',
    editing: true,
    ...customInitialProperties,
  }
}
