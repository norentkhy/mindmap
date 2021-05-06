import { v4 as uuidv4 } from 'uuid'
import { jest } from '@jest/globals'

export const createMocks = {
  function: jest.fn,
  hook: createUseViewmodel,
  state: createState,
  tab: createTab,
}

function createUseViewmodel(viewmodel) {
  return () => createViewmodel(viewmodel)
}

function createViewmodel(
  { state: givenState, action = emptyAction } = { ...emptyViewmodel }
) {
  return { state: createState(givenState), action }
}

function createState({ tabs: givenTabInfos = [] } = emptyState) {
  return { tabs: givenTabInfos.map(createTab) }
}

function createTab({ id, name }) {
  return { id: id || createId(), name }
}

const emptyState = { tabs: [] }
const emptyAction = { selectTab() {} }
const emptyViewmodel = { state: emptyState, action: emptyAction }

function createId(...args) {
  return uuidv4(...args)
}
