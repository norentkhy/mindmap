import React, { useContext } from 'react'
import { TabsProvider, TabsContext } from '~mindmap/components'
import { viewmodel } from '~mindmap/test-utilities'
import produce from 'immer'
import Collection from '../../data-structures/collection'
import { repeat } from '~/utils/FunctionalProgramming'

const tabs = [
  viewmodel.create.tab({ title: 'untitled' }),
  viewmodel.create.tab({ title: 'untitled' }),
  viewmodel.create.tab({ title: 'untitled' }),
]

describe('collection', () => {
  test('tabs starts with one', () => {
    const { state } = viewmodel.render()
    expect(state.getState().tabs.size).toBe(1)
  })

  test('first tab is untitled', () => {
    const { state } = viewmodel.render()
    expect(Collection.last(state.getState().tabs)).toEqual([
      { name: 'untitled' },
      viewmodel.expect.anId(),
    ])
  })

  test('first tab is selected', () => {
    const { state } = viewmodel.render()
    const [_, id] = Collection.last(state.getState().tabs)
    expect(state.getState().user.selectedTab).toBe(id)
  })

  test('add tabs', () => {
    const { state, action } = viewmodel.render()
    action.addNewTab()
    expect(state.getState().tabs.size).toBe(2)
  })

  test('newest tab is selected', () => {
    const { state, action } = viewmodel.render()
    action.addNewTab()
    const [_, id] = Collection.last(state.getState().tabs)
    expect(state.getState().user.selectedTab).toBe(id)
  })

  test('select tab', () => {
    const { state, action } = viewmodel.render()
    repeat(3, action.addNewTab)
    const [_tab, id] = Collection.last(state.getState().tabs)
    action.selectTab(id)
    expect(state.getState().user.selectedTab).toBe(id)
  })

  test('initiate rename tab', () => {
    const { state, action } = viewmodel.render()
    action.addNewTab()
    const [_, id] = Collection.last(state.getState().tabs)
    action.initiateRenameTab(id)
    expect(state.getState().user.renamingTab).toBe(id)
  })

  test('rename a tab', () => {
    const { state, action } = viewmodel.render()
    action.addNewTab()
    const [_, id] = Collection.last(state.getState().tabs)
    action.initiateRenameTab(id)
    action.finishRenameTab(id, 'renamed tab')
    const tab = Collection.get(state.getState().tabs, id)
    expect(tab).toMatchObject({ name: 'renamed tab' })
  })
})

describe('overlap with Tabs.spec', () => {
  test('selectTab', () => {
    const initialState = { tabs }
    const {
      state: { getState },
      actions: { selectTab },
    } = renderTest({ initialState })

    tabs.forEach(({ id }) => {
      selectTab(id)

      const targettedTab = getState().tabs.find((tab) => tab.id === id)
      expect(targettedTab.selected).toBe(true)

      const nonTargettedTabs = getState().tabs.filter((tab) => tab.id !== id)
      nonTargettedTabs.forEach((tab) => {
        expect(tab.selected).toBe(false)
      })
    })
  })

  test('addNewTab', () => {
    const initialState = { tabs: [] }
    const {
      state: { getState },
      actions: { addNewTab },
    } = renderTest({ initialState })

    ;[0, 1, 2].forEach((i) => {
      addNewTab()
      expect(getState().tabs.length).toBe(i + 1)

      const selectedTab = getState().tabs[i]
      const notSelectedTabs = getState().tabs.filter(
        (tab, index) => index !== i
      )
      expect(selectedTab.id).not.toBeFalsy()
      expect(selectedTab.selected).toBe(true)
      notSelectedTabs.forEach((tab) => expect(tab.selected).toBe(false))
    })

    expectIdsToBeUnique()

    function expectIdsToBeUnique() {
      const ids = getState().tabs.map((tab) => tab.id)
      const setIds = new Set(ids)
      expect(ids.length).toBe(setIds.size)
    }
  })

  describe('renaming a tab', () => {
    test('initiateRenameTab', () => {
      const initialState = { tabs }
      const {
        state: { getState },
        actions: { initiateRenameTab },
      } = renderTest({ initialState })

      const idTarget = tabs[0].id
      initiateRenameTab(idTarget)
      const targettedTab = getState().tabs.find((tab) => tab.id === idTarget)
      const nonTargettedTabs = getState().tabs.filter(
        (tab) => tab.id !== idTarget
      )
      expect(targettedTab.renaming).toBe(true)
      nonTargettedTabs.forEach((tab) => expect(tab.renaming).toBeFalsy())
    })

    test('finishRenameTab', () => {
      const indexTarget = 1
      const tabsWithOneRenaming = produce(tabs, (newTabs) => {
        newTabs[1].renaming = true
      })
      const initialState = { tabs: tabsWithOneRenaming }
      const {
        state: { getState },
        actions: { finishRenameTab },
      } = renderTest({ initialState })

      const idTarget = tabs[indexTarget].id
      const newTitle = 'renamed title'
      finishRenameTab({ id: idTarget, newTitle })

      const tabTarget = getState().tabs.find((tab) => tab.id === idTarget)
      expect(tabTarget.title).toBe(newTitle)
      getState().tabs.forEach((tab) => expect(tab.renaming).toBeFalsy())
    })
  })
})

function renderTest({ initialState }) {
  return viewmodel.render({
    useThisModel: () => useContext(TabsContext),
    wrapParents: ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    ),
  })
}
