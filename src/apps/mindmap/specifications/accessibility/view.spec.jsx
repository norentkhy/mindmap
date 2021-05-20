import { Actions, MainView, Tabs } from '~mindmap/components'
import { view, describe, test } from '~mindmap/test-utilities/view'
import React from 'react'

describe('accessibility: view components', () => {
  test('tabs', () => {
    view.render(<Tabs tabs={[]} />)
    view.expect.label('tabs').toBeVisible()
  })

  test('main view', () => {
    view.render(<MainView nodes={[]} />)
    view.expect.label('main view').toBeVisible()
  })

  test('actions', () => {
    view.render(<Actions actions={{}} />)
    view.expect.label('actions').toBeVisible()
  })
})
