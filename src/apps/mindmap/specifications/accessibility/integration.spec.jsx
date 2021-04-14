import MindMapApp from '~mindmap/App'

import React from 'react'
import { render, screen } from '@testing-library/react'

describe('view elements', () => {
  test('tabs', () => {
    render(<MindMapApp />)
    screen.getByLabelText(/^tabs$/i)
  })

  test('actions', () => {
    render(<MindMapApp />)
    screen.getByLabelText(/^actions$/i)
  })

  test('main view', () => {
    render(<MindMapApp />)
    screen.getByLabelText(/^main view$/i)
  })
})
