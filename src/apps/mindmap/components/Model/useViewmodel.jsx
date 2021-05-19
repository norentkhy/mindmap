import { useEffect, useReducer, useState } from 'react'
import produce, { enableMapSet } from 'immer'
import { v4 as uuidv4 } from 'uuid'
import { useTime } from '~mindmap/hooks/useTime'
import useResizeObserver from '@react-hook/resize-observer'
import Collection from '~mindmap/data-structures/collection'
import computeViewmodel from './compute-viewmodel'
enableMapSet()

function createInitialState() {
  const emptyCollection = Collection.create()
  const [tabs, tabId] = Collection.add(emptyCollection, createTab())
  return {
    trees: [],
    tabs,
    nodes: emptyCollection,
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
    useThisResizeObserver = useResizeObserver,
  } = {
    initialState: createInitialState(),
    useThisResizeObserver: useThisResizeObserver,
  }
) {
  const [state, dispatch] = useReducer(reduce, initialState)
  const { timeline, insertIntoTimeline, goBack, goForward } = useTime({
    initialPresent: state,
  })
  const actions = bindActionsTo(dispatch)
  const [current, setCurrent] = useState({ nodes: [] })

  useEffect(() => {
    insertIntoTimeline(state)
  }, [state])

  useEffect(() => {
    setCurrent(computeViewmodel(timeline.present, actions))
  }, [timeline.present])

  return {
    state: timeline.present,
    undo: goBack,
    redo: goForward,
    useThisResizeObserver,
    ...current,
    ...actions,
  }

  function reduce(state, action) {
    const transition = stateTransitions[action.type]
    const newState = transition(state, action.payload)

    return newState
  }
}

function bindActionsTo(dispatch) {
  return {
    createRootNode() {
      dispatch({ type: 'CREATE_ROOT_NODE' })
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
  CREATE_ROOT_NODE(state) {
    return produce(state, (newState) => {
      const [newNodes, id] = Collection.add(state.nodes, createNode())
      newState.nodes = newNodes
      newState.user.editingNodes.push(id)
      newState.user.focusedNode = id
    })
  },
  CREATE_CHILD_NODE(state, { parentId }) {
    return produce(state, (newState) => {
      const [newNodes, id] = Collection.add(state.nodes, createNode())
      newState.nodes = newNodes
      newState.arrows = Collection.replace(state.arrows, parentId, id)
      newState.user.editingNodes.push(id)
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
        tab.name = newName
      })
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

function createTab(name = 'untitled') {
  return { name }
}
