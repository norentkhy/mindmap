export default function computeGeneralActions(actions) {
  return {
    createTab: actions.addNewTab,
    createNode: actions.createRootNode,
    createNodeOnMouse: computeCreateNodeOnMouse(actions.createRootNode),
  }
}

function computeCreateNodeOnMouse(createRootNode) {
  return createNodeOnMouse

  function createNodeOnMouse(event) {
    const centerOffset = computeCenterOffset(event)
    createRootNode(centerOffset)
  }
}

function computeCenterOffset({ clientX, clientY, target }) {
  const { left, top } = target.getBoundingClientRect()
  return {
    left: clientX - left,
    top: clientY - top,
  }
}
