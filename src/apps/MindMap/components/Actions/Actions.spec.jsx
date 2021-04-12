import React from 'react'
import { render, screen } from '@testing-library/react'
import { Actions } from './Actions'
import { ProjectProvider } from '../Contexts/ProjectContext'

describe('inherited from MindMap.spec', () => {
  test('label: actions', () => {
    renderAsIntended()
    screen.getByLabelText(/^actions$/i)
  })

  function renderAsIntended() {
    return render(
      <ProjectProvider>
        <Actions />
      </ProjectProvider>
    )
  }
})
