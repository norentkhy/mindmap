import { Tabs } from 'src/components'
import {
  view,
  addIdTo,
  createMockFn,
  describe,
  test,
  expect,
} from 'src/test-utils'
import React from 'react'

describe('tabs: view', () => {
  test('view.render single tab', () => {
    const tab = addIdTo({ name: 'first tab' })
    view.render(<Tabs tabs={[tab]} />)
    view.expect.tab({ name: 'first tab' }).toBeVisible()
  })

  test('view.render multiple tabs', () => {
    const tabs = ['a', 'b', 'c', 'd'].map((name) => addIdTo({ name }))
    view.render(<Tabs tabs={tabs} />)
    tabs.forEach((tab) => view.expect.tab(tab).toBeVisible())
  })

  test('create a tab', () => {
    const createTab = createMockFn()
    view.render(<Tabs tabs={[]} createTab={createTab} />)
    view.clickOn.createTabButton()
    expect(createTab).toBeCalledTimes(1)
  })

  test('select a tab', () => {
    const tab = addIdTo({
      name: 'selecting this',
      do: { select: createMockFn() },
    })
    view.render(<Tabs tabs={[tab]} />)
    view.clickOn.tab(tab)
    expect(tab.do.select).toBeCalledTimes(1)
  })

  test('edit name of a tab', () => {
    const tab = addIdTo({
      name: 'editing this',
      renaming: false,
      do: { editName: createMockFn() },
    })
    view.render(<Tabs tabs={[tab]} />)
    view.doubleClickOn.tab(tab)
    expect(tab.do.editName).toBeCalledTimes(1)
  })

  test('finish renaming a tab', () => {
    const tab = addIdTo({
      name: 'this will be renamed',
      renaming: true,
      do: { rename: createMockFn() },
    })
    view.render(<Tabs tabs={[tab]} />)
    view.withKeyboard('type', 'new name')
    view.withKeyboard('press', 'enter')
    expect(tab.do.rename).nthCalledWith(1, 'new name')
  })
})
