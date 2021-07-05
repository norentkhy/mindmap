import MindMapApp from 'src/MindMap'
import { view, describe, test } from 'src/test-utils'
import React from 'react'

describe('view elements', () => {
  test('tabs', () => {
    view.render(<MindMapApp />)
    view.expect.label('tabs').toBeVisible()
  })
  test('actions', () => {
    view.render(<MindMapApp />)
    view.expect.label('interactive actions console').toBeVisible()
  })

  test('main view', () => {
    view.render(<MindMapApp />)
    view.expect.label('main view').toBeVisible()
  })
})
