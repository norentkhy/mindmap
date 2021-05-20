import { Tabs } from '~mindmap/components'
import { view, viewmodel, addIdTo } from '~mindmap/test-utilities'
import { render } from '@testing-library/react'
import React from 'react'

describe('tabs: view', () => {
  test('render single tab', () => {
    render(<Tabs tabs={[addIdTo({ title: 'first tab' })]} />)
    view.expect.tab({ title: 'first tab' }).toBeVisible()
  })

  test('render multiple tabs', () => {
    const tabs = ['a', 'b', 'c', 'd'].map((title) => addIdTo({ title }))
    render(<Tabs tabs={tabs} />)
    tabs.forEach((tab) => view.expect.tab(tab).toBeVisible())
  })

  test('create a tab', () => {
    const createTab = viewmodel.create.mockFunction()
    render(<Tabs tabs={[]} createTab={createTab} />)
    view.action.mouse.createNew.tab()
    viewmodel.expect.mockFunction(createTab).toBeCalledTimes(1)
  })

  test('select a tab', () => {
    const tab = addIdTo({
      title: 'selecting this',
      do: { select: viewmodel.create.mockFunction() },
    })
    render(<Tabs tabs={[tab]} />)
    view.action.clickOn.tab(tab)
    viewmodel.expect.mockFunction(tab.do.select).toBeCalledTimes(1)
  })

  test('edit name of a tab', () => {
    const tab = addIdTo({
      title: 'editing this',
      renaming: false,
      do: { editName: viewmodel.create.mockFunction() },
    })
    render(<Tabs tabs={[tab]} />)
    view.action.doubleClickOn.tab(tab)
    viewmodel.expect.mockFunction(tab.do.editName).toBeCalledTimes(1)
  })

  test('finish renaming a tab', () => {
    const tab = addIdTo({
      title: 'this will be renamed',
      renaming: true,
      do: { rename: viewmodel.create.mockFunction() },
    })
    render(<Tabs tabs={[tab]} />)
    view.action.keyboard.typeAndPressEnter('new name')
    viewmodel.expect.mockFunction(tab.do.rename).nthCalledWith(1, 'new name')
  })
})

