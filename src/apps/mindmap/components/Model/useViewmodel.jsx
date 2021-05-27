import { useEffect, useReducer, useState } from 'react'
import produce, { enableMapSet } from 'immer'
import { v4 as uuidv4 } from 'uuid'
import { useTime } from '~mindmap/hooks/useTime'
import { Collection, Space, Children } from '~mindmap/data-structures'
import computeViewmodel from './compute-viewmodel'
import useResizeObserver from '@react-hook/resize-observer'
enableMapSet()

function createInitialState() {
  const emptyCollection = Collection.create()
  const [tabs, tabId] = Collection.add(emptyCollection, createTab())
  return {
    tabs,
    nodes: emptyCollection,
    space: Space.create(),
    arrows: emptyCollection,
    user: {
      editingNodes: [],
      foldedNodes: [],
      selectedTab: tabId,
      renamingTab: null,
      focusedNode: null,
    },
  }
}

export default function useViewmodel(
  {
    initialState = createInitialState(),
    hooks = { useSizeObserver: useResizeObserver },
  } = {
    initialState: createInitialState(),
    hooks: { useSizeObserver: useResizeObserver },
  }
) {
  const [state, dispatch] = useReducer(reduce, initialState)
  const { timeline, insertIntoTimeline, goBack, goForward } = useTime({
    initialPresent: state,
  })
  const actions = { ...bindActionsTo(dispatch), undo: goBack, redo: goForward }
  const [current, setCurrent] = useState({
    nodes: [],
    tabs: [],
    do: { createTab() {} },
  })

  useEffect(() => {
    insertIntoTimeline(state)
  }, [state])

  useEffect(() => {
    const newViewmodel = computeViewmodel(timeline.present, actions, hooks)
    setCurrent(newViewmodel)
  }, [timeline.present])

  return {
    state: timeline.present,
    ...actions,
    ...current,
  }

  function reduce(state, action) {
    const transition = stateTransitions[action.type]
    const newState = transition(state, action.payload)

    return newState
  }
}

function bindActionsTo(dispatch) {
  return {
    createRootNode(centerOffset) {
      dispatch({ type: 'CREATE_ROOT_NODE', payload: centerOffset })
    },
    createChildNode({ parentId }) {
      dispatch({
        type: 'CREATE_CHILD_NODE',
        payload: { parentId },
      })
    },
    initiateEditNode({ id }) {
      dispatch({
        type: 'EDIT_NODE',
        payload: { id, editing: true },
      })
    },
    finalizeEditNode(payload) {
      dispatch({ type: 'EDIT_NODE', payload: { ...payload, editing: false } })
    },
    foldNode({ id }) {
      dispatch({ type: 'TOGGLE_NODE_FOLD', payload: { id } })
    },
    replaceState(newState) {
      dispatch({ type: 'REPLACE_STATE', payload: newState })
    },
    addNewTab() {
      dispatch({ type: 'ADD_NEW_TAB' })
    },
    selectTab(id) {
      dispatch({ type: 'SELECT_TAB', payload: id })
    },
    initiateRenameTab(id) {
      dispatch({ type: 'INITIATE_RENAME_TAB', payload: id })
    },
    finishRenameTab(id, newName) {
      dispatch({
        type: 'FINISH_RENAME_TAB',
        payload: { id, newName },
      })
    },
  }
}

const stateTransitions = {
  CREATE_ROOT_NODE(state, centerOffset) {
    return produce(state, (newState) => {
      const [newNodes, id] = Collection.add(state.nodes, createNode())
      newState.nodes = newNodes
      newState.space = Space.registerRoot(state.space, id, centerOffset)
      newState.user.editingNodes.push(id)
      newState.user.focusedNode = id
    })
  },
  CREATE_CHILD_NODE(state, { parentId }) {
    return produce(state, (newState) => {
      const [newNodes, childId] = Collection.add(state.nodes, createNode())
      newState.nodes = newNodes
      newState.space = Space.registerChild(state.space, {
        childId,
        parentId,
        siblingIds: Children.get(state.arrows, parentId),
      })
      newState.arrows = Collection.modify(
        state.arrows,
        parentId,
        (childIds) => {
          if (!childIds) return [childId]
          childIds.push(childId)
        }
      )
      newState.user.editingNodes.push(childId)
      newState.user.focusedNode = childId
    })
  },
  EDIT_NODE(state, { id, editing, ...modifications }) {
    return produce(state, (newState) => {
      newState.nodes = Collection.modify(state.nodes, id, (item) => ({
        ...item,
        ...modifications,
      }))
      if (editing) {
        newState.user.editingNodes.push(id)
        newState.user.focusedNode = id
      } else {
        newState.user.editingNodes.pop(id)
      }
    })
  },
  TOGGLE_NODE_FOLD(state, { id }) {
    return produce(state, (newState) => {
      if (id) {
        if (state.user.foldedNodes.includes(id))
          newState.user.foldedNodes = state.user.foldedNodes.filter(
            (id) => id !== id
          )
        else newState.user.foldedNodes.push(id)
      }
      newState.user.focusedNode = id
    })
  },
  ADD_NEW_TAB(state) {
    return produce(state, (newState) => {
      const [newTabs, tabId] = Collection.add(state.tabs, createTab())
      newState.tabs = newTabs
      newState.user.selectedTab = tabId
    })
  },
  SELECT_TAB(state, id) {
    return produce(state, (newState) => {
      newState.user.selectedTab = id
    })
  },
  INITIATE_RENAME_TAB(state, id) {
    return produce(state, (newState) => {
      newState.user.renamingTab = id
    })
  },
  FINISH_RENAME_TAB(state, { id, newName }) {
    return produce(state, (newState) => {
      newState.tabs = Collection.modify(state.tabs, id, (tab) => {
        tab.title = newName
      })
      newState.user.renamingTab = null
    })
  },
}

function createNode() {
  const customInitialProperties = {
    id: uuidv4(),
  }
  return {
    text: '',
    editing: true,
    ...customInitialProperties,
  }
}

function createTab(title = 'untitled') {
  return { title }
}
