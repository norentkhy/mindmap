import MindMapApp from '~mindmap/App'
import { view, describe, test } from '~mindmap/test-utilities'
import React from 'react'

describe('view elements', () => {
  test('tabs', () => {
    view.render(<MindMapApp />)
    view.expect.label('tabs').toBeVisible()
  })
  test('actions', () => {
    view.render(<MindMapApp />)
    view.expect.label('actions').toBeVisible()
  })

  test('main view', () => {
    view.render(<MindMapApp />)
    view.expect.label('main view').toBeVisible()
  })
})
