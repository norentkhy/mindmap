import { Actions } from '~mindmap/components/Actions/Actions'

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

describe('with mock providers', () => {
  test('undo', () => {
    const undoAction = jest.fn()
    renderWithMockHook({ undoAction })

    ui.undo()

    expect(undoAction).toHaveBeenCalled()
    expect(undoAction.mock.calls[0]).toEqual([])
  })

  test('redo', () => {
    const redoAction = jest.fn()
    renderWithMockHook({ redoAction })

    ui.redo()

    expect(redoAction).toHaveBeenCalled()
    expect(redoAction.mock.calls[0]).toEqual([])
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
