import { update } from '~/utils/FunctionalProgramming'
import Collection from './primitives/collection'

export default {
  init,
  isSelected,
  isRenaming,
  getArrayIdName,
  createUntitled,
  select,
  rename,
}

function init() {
  return createUntitled({
    names: Collection.create(),
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
  return update(tabs, {
    names: newNames,
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
