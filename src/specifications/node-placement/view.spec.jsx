import {
  view,
  createMockFn,
  describe,
  test,
  expect,
  addIdTo,
} from 'src/test-utils'
import React from 'react'
import MindNode from '../../components/MainView/MindNode'
import { MainView } from '../../components/index'

describe('mindboard placement', () => {
  test('handles click event with coordinates', () => {
    const handleDoubleClick = createMockFn()
    view.render(<MainView createNode={handleDoubleClick} />)
    view.doubleClickOn.mindSpace()
    expect(handleDoubleClick).nthCalledWith(
      1,
      expect.objectContaining({
        clientX: expect.any(Number),
        clientY: expect.any(Number),
        target: expect.objectContaining({
          getBoundingClientRect: expect.any(Function),
        }),
      })
    )
  })

  test('mindspace has relative position', () => {
    view.render(<MainView />)
    view.expect.mindSpace().toHaveStyle({ position: 'relative' })
  })
})
