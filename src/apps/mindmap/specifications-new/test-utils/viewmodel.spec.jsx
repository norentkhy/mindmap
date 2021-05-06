import { viewmodel } from '~/test-utils/viewmodel/index'

describe('mock state creation', () => {
  const desiredTabNames = ['test', 'this', 'as', 'a', 'something']
  const desiredTabs = desiredTabNames.map((name) => ({ name }))

  test('list of tabs', () => {
    const stateVerbose = viewmodel.createMock.state({
      tabs: desiredTabs.map((tab) => viewmodel.createMock.tab(tab)),
    })
    const stateShort = viewmodel.createMock.state({ tabs: desiredTabs })

    expectTabsToHaveId(stateVerbose)
    expectTabsToHaveId(stateShort)
    expectToHaveTheSameTabNames(stateVerbose, stateShort)
  })

  test(`tab id's are kept when provided`, () => {
    const tab = viewmodel.createMock.tab({name: 'has an id'})
    const sameTab = viewmodel.createMock.tab(tab)
    expect(tab.id).toBe(sameTab.id)
  })
})

function expectTabsToHaveId(state) {
  const ids = getTabKeys(state, 'id')
  ids.forEach((id) => expect(id).toBeTruthy())
}

function expectToHaveTheSameTabNames(state0, state1) {
  const names0 = getTabKeys(state0, 'name')
  const names1 = getTabKeys(state1, 'name')
  expect(names0).toEqual(names1)
}

function getTabKeys(state, key) {
  return state.tabs.map((tab) => tab[key])
}
