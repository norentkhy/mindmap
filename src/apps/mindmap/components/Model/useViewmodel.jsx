import { useEffect, useReducer, useState } from 'react'
import produce, { enableMapSet } from 'immer'
import { useTime } from '~mindmap/hooks/useTime'
import { Collection, Nodes } from '~mindmap/data-structures'
import computeViewmodel from './compute-viewmodel'
import useResizeObserver from '@react-hook/resize-observer'
import { update } from '~/utils/FunctionalProgramming'
enableMapSet()

function createInitialState() {
  const nodes = Nodes.init()
  const emptyCollection = Collection.create()
  const [tabs, tabId] = Collection.add(emptyCollection, createTab())
  return {
    tabs,
    nodes,
    user: {
      selectedTab: tabId,
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
  const [currentViewmodel, setCurrentViewmodel] = useState({
    nodes: [],
    tabs: [],
    do: { createTab() {} },
  })

  useEffect(() => {
    insertIntoTimeline(state)
  }, [state])

  useEffect(() => {
    const newViewmodel = computeViewmodel(timeline.present, actions, hooks)
    setCurrentViewmodel(newViewmodel)
  }, [timeline.present])

  return {
    state: timeline.present,
    ...actions,
    ...currentViewmodel,
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
    return update(state, {
      nodes: Nodes.createRoot(state.nodes, centerOffset),
    })
  },
  CREATE_CHILD_NODE(state, { parentId }) {
    return update(state, {
      nodes: Nodes.createChild(state.nodes, parentId),
    })
  },
  EDIT_NODE(state, { id, editing, ...modifications }) {
    return update(state, {
      nodes: Nodes.editContents(state.nodes, id, modifications),
    })
  },
  TOGGLE_NODE_FOLD(state, { id }) {
    return update(state, {
      nodes: Nodes.toggleFold(state.nodes, id),
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

function createTab(title = 'untitled') {
  return { title }
}
