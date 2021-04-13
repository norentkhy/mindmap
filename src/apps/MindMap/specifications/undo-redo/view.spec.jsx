import { Actions } from '~mindmap/components/Actions/Actions'

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

describe('with mock providers', () => {
  test('undo', () => {
    const undo = jest.fn()
    renderWithMockHook({ undo })

    ui.undo()

    expect(undo).toHaveBeenCalled()
    expect(undo.mock.calls[0]).toEqual([])
  })

  test('redo', () => {
    const redo = jest.fn()
    renderWithMockHook({ redo })

    ui.redo()

    expect(redo).toHaveBeenCalled()
    expect(redo.mock.calls[0]).toEqual([])
  })

  function renderWithMockHook(hookModifications) {
    return render(<Actions useThisModel={useMock} />)

    function useMock() {
      return {
        undo() {},
        redo() {},
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
