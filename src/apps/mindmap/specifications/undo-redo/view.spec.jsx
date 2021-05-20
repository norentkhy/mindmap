import { Actions } from '~mindmap/components'
import { viewmodel, view } from '~mindmap/test-utilities'
import { render } from '@testing-library/react'
import React from 'react'

describe('actions', () => {
  test('undo', () => {
    const undo = viewmodel.create.mockFunction()
    render(<Actions actions={{ undo }} />)
    view.action.mouse.clickOn.menu.undoAction()
    viewmodel.expect.mockFunction(undo).toBeCalled()
  })

  test('redo', () => {
    const redo = viewmodel.create.mockFunction()
    render(<Actions actions={{ redo }} />)
    view.action.mouse.clickOn.menu.redoAction()
    viewmodel.expect.mockFunction(redo).toBeCalled()
  })
})
