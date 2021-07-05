import { useMemo, useRef } from 'react'
import { useTime } from 'src/hooks/useTime'
import { Nodes, Viewmodel, Tabs } from 'src/data-structures'
import useResizeObserver from '@react-hook/resize-observer'
import { mapObject } from 'src/utils/FunctionalProgramming'

const initialState = {
  nodes: Nodes.init(),
  tabs: Tabs.init(),
}

const hooks = {
  useSizeObserver: useResizeObserver,
}

export default function useViewmodel() {
  const [timeline, forkTimeline, mutateTimeline, undo, redo] =
    useTime(initialState)
  const actions = useActions(forkTimeline, mutateTimeline, undo, redo)
  return useViewmodelUpdate(timeline.present, actions, hooks, timeline)
}

function useViewmodelUpdate(state, actions, hooks, timeline) {
  const prior = useRef({ state: null, viewmodel: null }).current
  const newViewmodel = Viewmodel.update(prior, state, actions, hooks, timeline)

  prior.state = state
  prior.viewmodel = newViewmodel
  return newViewmodel
}

function useActions(forkTimeline, mutateTimeline, undo, redo) {
  return useMemo(
    () => ({ ...bindStateChanges(forkTimeline, mutateTimeline), undo, redo }),
    [forkTimeline, undo, redo]
  )
}

function bindStateChanges(forkTimeline, mutateTimeline) {
  return {
    ...bindUpdates(partialNodeMutations, mutateTimeline),
    ...bindUpdates(partialNodeUpdates, forkTimeline),
    ...bindUpdates(partialTabUpdates, forkTimeline),
  }
}

function bindUpdates(updates, setState) {
  return mapObject(updates, (update) => {
    return bindUpdate(update, setState)
  })
}

function bindUpdate(update, setState) {
  return (...args) =>
    setState((state) => ({
      ...state,
      ...update(state, ...args),
    }))
}

const partialNodeUpdates = bindNodesMappingsToTabs({
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
    nodes: Nodes.select(state.nodes, id),
  }),
  foldNode: (state, { id }) => ({
    nodes: Nodes.toggleFold(state.nodes, id),
  }),
  shiftFocusTo: (state, direction) => ({
    nodes: Nodes.shiftFocusTo(state.nodes, direction),
  }),
  initiateMoveNode: (state, id, offset) => ({
    nodes: Nodes.initiateMove(state.nodes, id, offset),
  }),
  finalizeMoveNode: (state, offset) => ({
    nodes: Nodes.finalizeMove(state.nodes, offset),
  }),
  makeParent: (state, parentId, childId) => ({
    nodes: Nodes.makeParent(state.nodes, parentId, childId),
  }),
})

const partialNodeMutations = bindNodesMappingsToTabs({
  registerNodeSize: (state, id, size) => ({
    nodes: Nodes.registerSize(state.nodes, id, size),
  }),
})

const partialTabUpdates = {
  addNewTab: (state) => ({
    tabs: Tabs.createUntitled(state.tabs),
    nodes: Nodes.init(),
  }),
  selectTab: (state, id) => ({
    tabs: Tabs.select(state.tabs, id),
    nodes: Tabs.getNodesOf(state.tabs, id),
  }),
  initiateRenameTab: (state, id) => ({
    tabs: Tabs.rename(state.tabs, id),
  }),
  finishRenameTab: (state, id, newName) => ({
    tabs: Tabs.rename(state.tabs, id, newName),
  }),
}

function bindNodesMappingsToTabs(partialNodeUpdatesOrMutations) {
  return mapObject(partialNodeUpdatesOrMutations, bindNodesMappingToTabs)
}

function bindNodesMappingToTabs(mapNodes) {
  return (state, ...args) => {
    const newState = mapNodes(state, ...args)
    return {
      ...newState,
      tabs: Tabs.setNodesOfCurrent(state.tabs, newState.nodes),
    }
  }
}
