import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'
import React from 'react'

describe('tabs integration', () => {
  test('add a new tab', () => {
    view.render({ JSX: <MindMapApp /> })
    view.expect.untitledTab().not.toBeVisible()

    view.action.mouse.createNew.tab()
    view.expect.untitledTab().toBeVisible()

    view.action.mouse.createNew.tab()
    view.expect.numberOf.untitledTabs().toBe(2)
  })

  test('rename a tab', async () => {
    view.render({ JSX: <MindMapApp /> })

    view.action.mouse.createNew.tab()
    view.action.mouse.rename.tab({ title: 'untitled' })

    const someNewTitle = 'some new title'

    await view.waitFor.tabInput().toHaveFocus()
    view.action.keyboard.typeAndPressEnter(someNewTitle)

    view.expect.tab({ title: someNewTitle }).toBeVisible()
  })
})
