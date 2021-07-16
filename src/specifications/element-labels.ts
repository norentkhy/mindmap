export const uniqueLabel = {
  mindSpace: 'main view',
  linkSpace: 'link space',
  nodeSpace: 'node space',
}

export const nodeLabel = {
  rootTree: 'container of rootnode',
  node: 'node',
  nodeInput: 'editing node',
  childLink: 'child of parent',
  linkAnchor: 'anchor point of link',
}

export const tabLabel = { tabInput: 'renaming this tab' }

export const buttonLabel = {
    createRootNode: 'create root node',
    createTab: 'add new tab',
    undo: 'undo action',
    redo: 'redo action',
  }

export default {
  ...uniqueLabel,
  ...nodeLabel,
  ...tabLabel,
  ...buttonLabel,
  tabs: tabLabel,
  button: buttonLabel,
}
