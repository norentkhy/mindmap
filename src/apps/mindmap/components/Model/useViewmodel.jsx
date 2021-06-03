import { useEffect, useState } from 'react'
import { useTime } from '~mindmap/hooks/useTime'
import { Nodes, Viewmodel, Tabs } from '~mindmap/data-structures'
import useResizeObserver from '@react-hook/resize-observer'
import { mapObject } from '~/utils/FunctionalProgramming'

const initialState = {
  nodes: Nodes.init(),
  tabs: Tabs.init(),
}

const hooks = {
  useSizeObserver: useResizeObserver,
}

export default function useViewmodel() {
  const [state, setState] = useState(initialState)
  const [timeline, forkTimeline, undo, redo] = useTime(state)
  const actions = { ...bindStateChanges(setState), undo, redo }
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
}

function bindStateChanges(setState) {
  return {
    ...bindUpdates(partialNodeUpdates, setState),
    ...bindUpdates(partialTabUpdates, setState),
  }
}

function bindUpdates(updates, setState) {
  return mapObject(updates, (update) => bindUpdate(update, setState))
}

function bindUpdate(update, setState) {
  return (...args) =>
    setState((state) => ({
      ...state,
      ...update(state, ...args),
    }))
}

const partialNodeUpdates = {
  createRootNode: (state, centerOffset) => ({
    nodes: Nodes.createRoot(state.nodes, centerOffset),
  }),
  createChildNode: (state, parentId) => ({
    nodes: Nodes.createChild(state.nodes, parentId),
  }),
  initiateEditNode: (state, id) => ({
    nodes: Nodes.editContents(state.nodes, id),
  }),
  finalizeEditNode: (state, { id, text }) => ({
    nodes: Nodes.editContents(state.nodes, id, { text }),
  }),
  foldNode: (state, { id }) => ({
    nodes: Nodes.toggleFold(state.nodes, id),
  }),
}

const partialTabUpdates = {
  addNewTab: (state) => ({
    tabs: Tabs.createUntitled(state.tabs),
  }),
  selectTab: (state, id) => ({
    tabs: Tabs.select(state.tabs, id),
  }),
  initiateRenameTab: (state, id) => ({
    tabs: Tabs.rename(state.tabs, id),
  }),
  finishRenameTab: (state, id, newName) => ({
    tabs: Tabs.rename(state.tabs, id, newName),
  }),
}
