import { Actions } from '~mindmap/components'
import {
  view,
  createMockFn,
  describe,
  test,
  expect,
} from '~mindmap/test-utilities'
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
