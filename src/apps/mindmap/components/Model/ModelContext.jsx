import React, { createContext, useEffect, useReducer } from 'react'
import produce, { enableMapSet } from 'immer'
import { v4 as uuidv4 } from 'uuid'
import { useTime } from '~mindmap/hooks/useTime'
import useResizeObserver from '@react-hook/resize-observer'
import Collection from '~mindmap/data-structures/collection'
enableMapSet()

export const ModelContext = createContext()

function createTab(name = 'untitled') {
  return { name }
}

function createInitialState() {
  const emptyCollection = Collection.create()
  const [tabs, tabId] = Collection.add(emptyCollection, createTab())
  return {
    trees: [],
    origin: { left: 100, top: 100 },
    tabs,
    nodes: emptyCollection,
    arrows: emptyCollection,
    user: {
      editingNodes: [],
      foldedNodes: [],
      selectedTab: tabId,
      renamingTab: null,
    },
  }
}

export function ModelProvider({
  children,
  initialState = createInitialState(),
  useThisResizeObserver = useResizeObserver,
  logResize = () => {},
}) {
  const newViewModel = useMainView({
    initialState,
    useThisResizeObserver,
    logResize,
  })

  return (
    <ModelContext.Provider value={newViewModel}>
      {children}
    </ModelContext.Provider>
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
    createChildNode({ parentId, parentCollectionId }) {
      dispatch({
        type: 'CREATE_CHILD_NODE',
        payload: { parentId, parentCollectionId },
      })
    },
    initiateEditNode({ id, collectionId }) {
      dispatch({
        type: 'EDIT_NODE',
        payload: { id, collectionId, editing: true },
      })
    },
    finalizeEditNode(payload) {
      dispatch({ type: 'EDIT_NODE', payload: { ...payload, editing: false } })
    },
    foldNode({ id, collectionId }) {
      dispatch({ type: 'TOGGLE_NODE_FOLD', payload: { id, collectionId } })
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
    addNewTab() {
      dispatch({ type: 'ADD_NEW_TAB' })
    },
    selectTab(collectionId) {
      dispatch({ type: 'SELECT_TAB', payload: collectionId })
    },
    initiateRenameTab(collectionId) {
      dispatch({ type: 'INITIATE_RENAME_TAB', payload: collectionId })
    },
    finishRenameTab(collectionId, newName) {
      dispatch({
        type: 'FINISH_RENAME_TAB',
        payload: { collectionId, newName },
      })
    },
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
      const [newNodes, id] = Collection.add(state.nodes, { id: node.id })
      newState.nodes = newNodes
      newState.user.editingNodes.push(id)
      newState.user.focusedNode = id
    })
  },
  CREATE_CHILD_NODE(state, { parentId, parentCollectionId }) {
    return produce(state, (newState) => {
      if (parentCollectionId)
        parentId = Collection.get(state.nodes, parentCollectionId).id

      const parentNode = getNode({ id: parentId, trees: newState.trees })
      if (!parentNode.children) parentNode.children = []

      const node = createNode(parentNode)
      parentNode.children.push(node)

      if (parentCollectionId) {
        const [newNodes, id] = Collection.add(state.nodes, { id: node.id })
        newState.nodes = newNodes
        newState.arrows = Collection.replace(
          state.arrows,
          parentCollectionId,
          id
        )
      }
    })
  },
  EDIT_NODE(state, { id, collectionId, editing, ...modifications }) {
    return produce(state, (newState) => {
      if (collectionId) {
        id = Collection.get(state.nodes, collectionId).id
        newState.nodes = Collection.modify(
          state.nodes,
          collectionId,
          (item) => ({ ...item, ...modifications })
        )
        if (editing) {
          newState.user.editingNodes.push(collectionId)
          newState.user.focusedNode = collectionId
        } else {
          newState.user.editingNodes.pop(collectionId)
          newState.user.focusedNode = null
        }
      }
      modifyNode({ id, newState, modifications: { editing, ...modifications } })
    })
  },
  TOGGLE_NODE_FOLD(state, { id, collectionId }) {
    return produce(state, (newState) => {
      if (collectionId) {
        if (state.user.foldedNodes.includes(collectionId))
          newState.user.foldedNodes = state.user.foldedNodes.filter(
            (id) => id !== collectionId
          )
        else newState.user.foldedNodes.push(collectionId)

        id = Collection.get(state.nodes, collectionId).id
      }

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
  ADD_NEW_TAB(state) {
    return produce(state, (newState) => {
      const [newTabs, tabId] = Collection.add(state.tabs, createTab())
      newState.tabs = newTabs
      newState.user.selectedTab = tabId
    })
  },
  SELECT_TAB(state, collectionId) {
    return produce(state, (newState) => {
      newState.user.selectedTab = collectionId
    })
  },
  INITIATE_RENAME_TAB(state, collectionId) {
    return produce(state, (newState) => {
      newState.user.renamingTab = collectionId
    })
  },
  FINISH_RENAME_TAB(state, { collectionId, newName }) {
    return produce(state, (newState) => {
      newState.tabs = Collection.modify(state.tabs, collectionId, (tab) => {
        tab.name = newName
      })
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
    const desiredOffsets = computeDesiredOffsets({
      measuredSurface,
      node,
    })
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
