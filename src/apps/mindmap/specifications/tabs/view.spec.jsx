import { Tabs } from '~mindmap/components'
import { ui } from '~mindmap/test-utilities/view'
import { createMockContextProvider } from 'test-utils/react-mocks'
import { v4 as uuidv4 } from 'uuid'

import React from 'react'

describe('rendered with mocks', () => {
  const tabs = [
    { id: createUuid(), title: 'untitled', selected: true },
    { id: createUuid(), title: 'untitled', selected: false },
    { id: createUuid(), title: 'untitled', selected: false },
  ]

  describe('views', () => {
    test('add new tab', () => {
      const addNewTab = createMockFn()
      renderWithMock({ addNewTab })

      ui.createNew.tab()
      expect(addNewTab).toHaveBeenCalled()
    })

    test('render of tabs in state', () => {
      renderWithMock({ state: { tabs } })

      tabs.forEach((_, index) => {
        ui.expect.tab({ index }).toBeVisible()
      })
    })
  })

  describe('tab selection', () => {
    test('function call to view model', () => {
      const selectTab = createMockFn()
      renderWithMock({ state: { tabs }, selectTab })

      tabs.forEach(({ id }, index) => {
        ui.mouseAction.clickOn.tab({ index })
        const nthCall = index + 1
        expect(selectTab).nthCalledWith(nthCall, id)
      })
    })

    test('state result from view model', () => {
      renderWithMock({ state: { tabs } })

      tabs.forEach((tab, index) =>
        ui.expect
          .tab({ index })
          .toHaveStyle({ 'font-weight': tab.selected ? 'bold' : 'normal' })
      )
    })
  })

  describe('tab renaming', () => {
    test('function call to view model', () => {
      const initiateRenameTab = createMockFn()
      renderWithMock({ state: { tabs }, initiateRenameTab })

      tabs.forEach((tab, index) => {
        ui.rename.tab({ index })
        const nthCall = index + 1
        expect(initiateRenameTab).nthCalledWith(nthCall, tab.id)
      })
    })

    test('result from rename initiation', () => {
      const {
        tabTarget,
        nonTargetTabs,
        finishRenameTab,
      } = renderWithTabInRenameMode()
      ui.expect.tab(tabTarget).not.toBeVisible()

      nonTargetTabs.forEach((tabInfo) => ui.expect.tab(tabInfo).toBeVisible())

      ui.expect.focus().toHaveTextSelection(tabTarget.title)

      const someNewTitle = 'some new title'
      ui.keyboardAction.typeAndPressEnter(someNewTitle)

      expect(finishRenameTab).nthCalledWith(1, {
        id: tabTarget.id,
        newTitle: someNewTitle,
      })

      function renderWithTabInRenameMode() {
        const {
          tabTarget,
          nonTargetTabs,
          state,
        } = createSituationWithOneRenaming()

        const finishRenameTab = createMockFn()
        renderWithMock({ state, finishRenameTab })

        return {
          tabTarget,
          nonTargetTabs,
          finishRenameTab,
        }

        function createSituationWithOneRenaming() {
          const tabTarget = tabs[2]
          const tabsWithOneRenaming = tabs.map((tab) => ({
            ...tab,
            renaming: tab.id === tabTarget.id,
          }))
          const nonTargetTabs = tabsWithOneRenaming.filter(
            (tab) => tab.id !== tabTarget.id
          )

          const state = { tabs: tabsWithOneRenaming }

          return { tabTarget, nonTargetTabs, state }
        }
      }
    })
  })

  function renderWithMock(modifications) {
    const [MockContext, MockProvider] = createMockContextProvider({
      modifications,
    })

    ui.render(
      <MockProvider viewModelModifications={modifications}>
        <Tabs theTabsContext={MockContext} />
      </MockProvider>
    )
  }
})

function createUuid() {
  return uuidv4()
}

function createMockFn(...args) {
  return jest.fn(...args)
}
