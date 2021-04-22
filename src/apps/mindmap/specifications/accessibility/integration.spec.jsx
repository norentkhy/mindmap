import MindMapApp from '~mindmap/App'
import { view } from '~mindmap/test-utilities/view'
import React from 'react'

describe('view elements', () => {
  test('tabs', () => {
    view.render({ JSX: <MindMapApp /> })
    view.query.byLabel('tabs')
  })
  test('actions', () => {
    view.render({ JSX: <MindMapApp /> })
    view.query.byLabel('actions')
  })

  test('main view', () => {
    view.render({ JSX: <MindMapApp /> })
    view.query.byLabel('main view')
  })
})
