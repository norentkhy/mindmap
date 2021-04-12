import MindMap from '~mindmap/MindMap'

import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import 'jest-styled-components'

describe('tabs integration', () => {
  test('add a new tab', () => {
    render(<MindMap />)
    expect(screen.queryByText('untitled')).toBeNull()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getByText('untitled')).toBeVisible()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getAllByText('untitled').length).toBe(2)
  })

  test('rename a tab', () => {
    render(<MindMap />)
    fireEvent.click(screen.getByLabelText('add new tab'))
    fireEvent.doubleClick(screen.getByText('untitled'))

    const someNewTitle = 'some new title'
    userEvent.type(document.activeElement, someNewTitle)
    userEvent.type(document.activeElement, '{enter}')

    expect(screen.getByText(someNewTitle)).toBeVisible()
  })
})
