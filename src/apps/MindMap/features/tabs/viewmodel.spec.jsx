import React, { useContext } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { v4 as uuidv4 } from 'uuid'
import { TabsProvider, TabsContext } from '~mindmap/components/Tabs/TabsContext'
import produce from 'immer'

const tabs = [
  { id: uuidv4(), title: 'untitled' },
  { id: uuidv4(), title: 'untitled-2' },
  { id: uuidv4(), title: 'untitled-3' },
]

describe('overlap with Tabs.spec', () => {
  test('selectTab', () => {
    const initialState = { tabs }
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    )
    const { result } = renderHook(() => useContext(TabsContext), { wrapper })

    tabs.forEach(({ id }) => {
      act(() => result.current.selectTab(id))

      const targettedTab = result.current.state.tabs.find(
        (tab) => tab.id === id
      )
      expect(targettedTab.selected).toBe(true)

      const nonTargettedTabs = result.current.state.tabs.filter(
        (tab) => tab.id !== id
      )
      nonTargettedTabs.forEach((tab) => {
        expect(tab.selected).toBe(false)
      })
    })
  })

  test('addNewTab', () => {
    const initialState = { tabs: [] }
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    )
    const { result } = renderHook(() => useContext(TabsContext), { wrapper })

    ;[0, 1, 2].forEach((i) => {
      act(() => result.current.addNewTab())
      expect(result.current.state.tabs.length).toBe(i + 1)

      const selectedTab = result.current.state.tabs[i]
      const notSelectedTabs = result.current.state.tabs.filter(
        (tab, index) => index !== i
      )
      expect(selectedTab.id).not.toBeFalsy()
      expect(selectedTab.selected).toBe(true)
      notSelectedTabs.forEach((tab) => expect(tab.selected).toBe(false))
    })

    expectIdsToBeUnique()

    function expectIdsToBeUnique() {
      const ids = result.current.state.tabs.map((tab) => tab.id)
      const setIds = new Set(ids)
      expect(ids.length).toBe(setIds.size)
    }
  })

  describe('renaming a tab', () => {
    test('initiateRenameTab', () => {
      const initialState = { tabs }
      const wrapper = ({ children }) => (
        <TabsProvider initialState={initialState}>{children}</TabsProvider>
      )
      const { result } = renderHook(() => useContext(TabsContext), { wrapper })

      const idTarget = tabs[0].id
      act(() => result.current.initiateRenameTab(idTarget))
      const targettedTab = result.current.state.tabs.find(
        (tab) => tab.id === idTarget
      )
      const nonTargettedTabs = result.current.state.tabs.filter(
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
      const wrapper = ({ children }) => (
        <TabsProvider initialState={initialState}>{children}</TabsProvider>
      )
      const { result } = renderHook(() => useContext(TabsContext), { wrapper })

      const idTarget = tabs[indexTarget].id
      const newTitle = 'renamed title'
      act(() => result.current.finishRenameTab({ id: idTarget, newTitle }))

      const tabTarget = result.current.state.tabs.find(
        (tab) => tab.id === idTarget
      )
      expect(tabTarget.title).toBe(newTitle)
      result.current.state.tabs.forEach((tab) =>
        expect(tab.renaming).toBeFalsy()
      )
    })
  })
})
