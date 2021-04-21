import MindMapApp from '~mindmap/App'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'

describe('view elements', () => {
  test('tabs', () => {
    ui.renderView({ JSX: <MindMapApp /> })
    ui.query.byLabel('tabs')
  })
  test('actions', () => {
    ui.renderView({ JSX: <MindMapApp /> })
    ui.query.byLabel('actions')
  })

  test('main view', () => {
    ui.renderView({ JSX: <MindMapApp /> })
    ui.query.byLabel('main view')
  })
})
