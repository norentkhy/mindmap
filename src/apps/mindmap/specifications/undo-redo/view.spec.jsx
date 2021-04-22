import { Actions } from '~mindmap/components'
import { viewmodel } from '~mindmap/test-utilities'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

describe('with mock providers', () => {
  test('undo', () => {
    const undo = viewmodel.create.mockFunction()
    renderWithMockHook({ undo })

    ui.undo()

    viewmodel.expect.mockFunction(undo).toBeCalledWith()
  })

  test('redo', () => {
    const redo = viewmodel.create.mockFunction()
    renderWithMockHook({ redo })

    ui.redo()

    viewmodel.expect.mockFunction(redo).toBeCalledWith()
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

//TODO: use encapsulated test-utility view/ui
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
