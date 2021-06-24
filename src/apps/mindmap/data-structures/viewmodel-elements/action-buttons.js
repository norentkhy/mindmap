import { Nodes } from '../index'

const CREATE_NODE = {
  staticProps: { text: 'create root node', label: 'create root node' },
  bindProps: (deps) => ({
    callback: () => deps.actions.createRootNode(),
  }),
}

const CREATE_CHILD = {
  staticProps: { text: 'create child node', label: 'create child node' },
  bindProps: (deps) => ({
    disabled: Nodes.isEditingAny(deps.nodes) || !deps.nodes.focusedId,
    callback: () => {
      const focusedId = Nodes.getFocusedId(deps.nodes)
      return deps.actions.createChildNode(focusedId)
    },
  }),
}

const SUBMIT_TEXT = {
  staticProps: { text: 'submit text', label: 'submit text' },
  bindProps: (deps) => ({
    disabled: !Nodes.isEditingAny(deps.nodes),
    callback: deps.actions.finalizeEditNode,
  }),
}

const UNDO = {
  staticProps: { text: 'undo', label: 'undo' },
  bindProps: (deps) => ({
    disabled: !deps.timeline.pasts.length,
    callback: () => deps.actions.undo(),
  }),
}

const REDO = {
  staticProps: { text: 'redo', label: 'redo' },
  bindProps: (deps) => ({
    disabled: !deps.timeline.futures.length,
    callback: () => deps.actions.redo(),
  }),
}

const NAVIGATE_LEFT = {
  staticProps: { text: 'navigate left', label: 'navigate left' },
  bindProps: (deps) => ({
    disabled: isNavigationAvailable(deps),
    callback: () => deps.actions.shiftFocusTo('left'),
  }),
}

const NAVIGATE_RIGHT = {
  staticProps: { text: 'navigate right', label: 'navigate right' },
  bindProps: (deps) => ({
    disabled: isNavigationAvailable(deps),
    callback: () => deps.actions.shiftFocusTo('right'),
  }),
}

const NAVIGATE_UP = {
  staticProps: { text: 'navigate up', label: 'navigate up' },
  bindProps: (deps) => ({
    disabled: isNavigationAvailable(deps),
    callback: () => deps.actions.shiftFocusTo('up'),
  }),
}

const NAVIGATE_DOWN = {
  staticProps: { text: 'navigate down', label: 'navigate down' },
  bindProps: (deps) => ({
    disabled: isNavigationAvailable(deps),
    callback: () => deps.actions.shiftFocusTo('down'),
  }),
}

export default {
  CREATE_NODE,
  CREATE_CHILD,
  SUBMIT_TEXT,
  UNDO,
  REDO,
  NAVIGATE_LEFT,
  NAVIGATE_RIGHT,
  NAVIGATE_UP,
  NAVIGATE_DOWN,
}

function isNavigationAvailable(deps) {
  return Nodes.getAmount(deps.nodes) < 2
}
