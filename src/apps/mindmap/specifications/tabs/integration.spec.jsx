import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'

describe('tabs integration', () => {
  test('add a new tab', () => {
    ui.render(<MindMapApp />)
    ui.expect.untitledTab().not.toBeVisible()

    ui.createNew.tab()
    ui.expect.untitledTab().toBeVisible()

    ui.createNew.tab()
    ui.expect.numberOf.untitledTabs().toBe(2)
  })

  test('rename a tab', async () => {
    ui.render(<MindMapApp />)

    ui.createNew.tab()
    ui.rename.tab({ title: 'untitled' })

    const someNewTitle = 'some new title'

    await ui.waitFor.tabInput().toHaveFocus()
    ui.keyboardAction.typeAndPressEnter(someNewTitle)

    ui.expect.tab({ title: someNewTitle }).toBeVisible()
  })
})
