import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'

describe('view elements', () => {
  test('tabs', () => {
    ui.render(<MindMapApp />)
    ui.query.byLabel('tabs')
  })
  test('actions', () => {
    ui.render(<MindMapApp />)
    ui.query.byLabel('actions')
  })

  test('main view', () => {
    ui.render(<MindMapApp />)
    ui.query.byLabel('main view')
  })
})
