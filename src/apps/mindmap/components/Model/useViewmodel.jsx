import { useEffect, useReducer, useState } from 'react'
import { useTime } from '~mindmap/hooks/useTime'
import { Nodes, Viewmodel, Tabs } from '~mindmap/data-structures'
import useResizeObserver from '@react-hook/resize-observer'

const initialState = {
  nodes: Nodes.init(),
  tabs: Tabs.init(),
}

export default function useViewmodel(modifications) {
  const hooks = computeHooks(modifications)
  const [state, dispatch] = useReducer(reduce, initialState)
  const [timeline, forkTimeline, undo, redo] = useTime(state)
  const actions = { ...bindActionsTo(dispatch), undo, redo }
  const [currentViewmodel, setCurrentViewmodel] = useState({
    nodes: [],
    tabs: [],
    do: { createTab() {} },
  })

  useEffect(() => {
    forkTimeline(state)
  }, [state])

  useEffect(() => {
    const newViewmodel = Viewmodel.compute(timeline.present, actions, hooks)
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

function computeHooks(hooks) {
  return {
    useSizeObserver: useResizeObserver,
    ...hooks,
  }
}

function bindActionsTo(dispatch) {
  return {
    createRootNode(centerOffset) {
      dispatch({ type: 'CREATE_ROOT_NODE', payload: centerOffset })
    },
    createChildNode(parentId) {
      dispatch({ type: 'CREATE_CHILD_NODE', payload: { parentId } })
    },
    initiateEditNode(id) {
      dispatch({ type: 'EDIT_NODE', payload: { id, editing: true } })
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
      dispatch({ type: 'FINISH_RENAME_TAB', payload: { id, newName } })
    },
  }
}

const stateTransitions = {
  CREATE_ROOT_NODE(state, centerOffset) {
    return { ...state, nodes: Nodes.createRoot(state.nodes, centerOffset) }
  },
  CREATE_CHILD_NODE(state, { parentId }) {
    return { ...state, nodes: Nodes.createChild(state.nodes, parentId) }
  },
  EDIT_NODE(state, { id, editing, ...changes }) {
    return { ...state, nodes: Nodes.editContents(state.nodes, id, changes) }
  },
  TOGGLE_NODE_FOLD(state, { id }) {
    return { ...state, nodes: Nodes.toggleFold(state.nodes, id) }
  },
  ADD_NEW_TAB(state) {
    return { ...state, tabs: Tabs.createUntitled(state.tabs) }
  },
  SELECT_TAB(state, id) {
    return { ...state, tabs: Tabs.select(state.tabs, id) }
  },
  INITIATE_RENAME_TAB(state, id) {
    return { ...state, tabs: Tabs.rename(state.tabs, id) }
  },
  FINISH_RENAME_TAB(state, { id, newName }) {
    return { ...state, tabs: Tabs.rename(state.tabs, id, newName) }
  },
}
