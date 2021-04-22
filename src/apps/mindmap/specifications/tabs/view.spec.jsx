import { Tabs } from '~mindmap/components'
import { ui, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('rendered with mocks', () => {
  const tabs = [
    viewmodel.create.tab({ selected: true }),
    viewmodel.create.tab({ selected: false }),
    viewmodel.create.tab({ selected: false }),
  ]

  describe('views', () => {
    test('add new tab', () => {
      const addNewTab = viewmodel.create.mockFunction()
      renderWithMock({ addNewTab })

      ui.createNew.tab()
      viewmodel.expect.mockFunction(addNewTab).toBeCalled()
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
      const selectTab = viewmodel.create.mockFunction()
      renderWithMock({ state: { tabs }, selectTab })

      tabs.forEach(({ id }, index) => {
        ui.mouseAction.clickOn.tab({ index })
        const nthCall = index + 1
        viewmodel.expect.mockFunction(selectTab).nthCalledWith(nthCall, id)
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
      const initiateRenameTab = viewmodel.create.mockFunction()
      renderWithMock({ state: { tabs }, initiateRenameTab })

      tabs.forEach((tab, index) => {
        ui.rename.tab({ index })
        const nthCall = index + 1
        viewmodel.expect
          .mockFunction(initiateRenameTab)
          .nthCalledWith(nthCall, tab.id)
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

      viewmodel.expect.mockFunction(finishRenameTab).nthCalledWith(1, {
        id: tabTarget.id,
        newTitle: someNewTitle,
      })

      function renderWithTabInRenameMode() {
        const {
          tabTarget,
          nonTargetTabs,
          state,
        } = createSituationWithOneRenaming()

        const finishRenameTab = viewmodel.create.mockFunction()
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
    ui.renderView({
      injectMockModelIntoJSX: ({ MockContext }) => (
        <Tabs theTabsContext={MockContext} />
      ),
      mockHookModifications: modifications,
    })
  }
})
