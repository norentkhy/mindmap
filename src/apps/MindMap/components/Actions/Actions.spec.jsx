import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
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

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = jest.fn()
    renderWithMockHook({ createRootNode })

    ui.createRootNode()

    expect(createRootNode).toHaveBeenCalled()
  })

  function renderWithMockHook(hookModifications) {
    return render(<Actions useHook={useMock} />)

    function useMock() {
      return {
        undoAction() {},
        redoAction() {},
        createRootNode() {},
        ...hookModifications,
      }
    }
  }
})

const ui = {
  undo() {
    const Button = getButton('undo action')
    click(Button)
  },
  redo() {
    const Button = getButton('redo action')
    click(Button)
  },
  createRootNode() {
    const Button = getButton('create root node')
    click(Button)
  },
}

function getButton(labeltext) {
  return screen.getByLabelText(labeltext)
}

function click(Element) {
  fireEvent.click(Element)
}
