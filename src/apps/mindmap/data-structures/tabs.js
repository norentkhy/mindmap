import { update } from '~/utils/FunctionalProgramming'
import { Nodes } from './index'
import Collection from './primitives/collection'

export default {
  init,
  isSelected,
  isRenaming,
  getArrayIdName,
  createUntitled,
  select,
  rename,
  getNodesOf,
  setNodesOf,
  setNodesOfCurrent,
}

function init() {
  return createUntitled({
    names: Collection.create(),
    nodes: Collection.create(),
    selectedId: null,
    renamingId: null,
  })
}

function isSelected(tabs, id) {
  return tabs.selectedId === id
}

function isRenaming(tabs, id) {
  return tabs.renamingId === id
}

function getArrayIdName(tabs) {
  return Array.from(tabs.names)
}

function createUntitled(tabs) {
  const [newNames, id] = Collection.add(tabs.names, 'untitled')
  const newNodes = Collection.set(tabs.nodes, id, Nodes.init())
  return update(tabs, {
    names: newNames,
    nodes: newNodes,
    selectedId: id,
  })
}

function select(tabs, id) {
  return update(tabs, { selectedId: id })
}

function rename(tabs, id, newName) {
  if (tabs.renamingId === id)
    return update(tabs, {
      names: Collection.replace(tabs.names, id, newName),
      renamingId: null,
    })

  return update(tabs, {
    renamingId: id,
  })
}

function getNodesOf(tabs, id) {
  return Collection.get(tabs.nodes, id)
}

function setNodesOf(tabs, id, nodes) {
  return update(tabs, { nodes: Collection.set(tabs.nodes, id, nodes) })
}

function setNodesOfCurrent(tabs, nodes) {
  return setNodesOf(tabs, tabs.selectedId, nodes)
}
