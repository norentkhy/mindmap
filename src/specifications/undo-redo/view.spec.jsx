import { Actions } from 'src/components'
import {
  view,
  createMockFn,
  describe,
  test,
  expect,
} from 'src/test-utils'
import React from 'react'

describe('actions', () => {
  test('undo', () => {
    const undo = createMockFn()
    view.render(<Actions actions={{ undo }} />)
    view.clickOn.undoButton()
    expect(undo).toBeCalled()
  })

  test('redo', () => {
    const redo = createMockFn()
    view.render(<Actions actions={{ redo }} />)
    view.clickOn.redoButton()
    expect(redo).toBeCalled()
  })
})
