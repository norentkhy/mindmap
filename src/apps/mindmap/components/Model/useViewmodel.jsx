import { useMemo, useRef } from 'react'
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
  const [timeline, forkTimeline, undo, redo] = useTime(initialState)
  const actions = useActions(forkTimeline, undo, redo)
  // return Viewmodel.compute(timeline.present, actions, hooks)
  return useViewmodelUpdate(timeline.present, actions, hooks) //
}

function useViewmodelUpdate(state, actions, hooks) {
  const prior = useRef({ state: null, viewmodel: null }).current
  const newViewmodel = Viewmodel.update(prior, state, actions, hooks)

  prior.state = state
  prior.viewmodel = newViewmodel
  return newViewmodel
}

function useActions(forkTimeline, undo, redo) {
  return useMemo(
    () => ({ ...bindStateChanges(forkTimeline), undo, redo }),
    [forkTimeline, undo, redo]
  )
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
  selectNode: (state, id) => ({
    nodes: Nodes.select(state.nodes, id)
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
