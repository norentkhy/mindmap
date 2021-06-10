import { computeCenterOffset } from './mouse-computations'

export default function computeGeneralActions(actions) {
  return {
    undo: actions.undo,
    redo: actions.redo,
    createTab: actions.addNewTab,
    createNode: actions.createRootNode,
    createNodeOnMouse: computeCreateNodeOnMouse(actions.createRootNode),
    navigate: actions.shiftFocusTo
  }
}

function computeCreateNodeOnMouse(createRootNode) {
  return createNodeOnMouse

  function createNodeOnMouse(event) {
    const centerOffset = computeCenterOffset(event)
    createRootNode(centerOffset)
  }
}
