import { Actions } from '~mindmap/components'
import { model } from '~mindmap/test-utilities'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

describe('with mock providers', () => {
  test('undo', () => {
    const undo = model.create.mockFunction()
    renderWithMockHook({ undo })

    ui.undo()

    model.expect.mockFunction(undo).toBeCalledWith()
  })

  test('redo', () => {
    const redo = model.create.mockFunction()
    renderWithMockHook({ redo })

    ui.redo()

    model.expect.mockFunction(redo).toBeCalledWith()
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
