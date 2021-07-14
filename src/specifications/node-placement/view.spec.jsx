import {
  view,
  createMockFn,
  describe,
  test,
  expect,
} from 'src/test-utils'
import React from 'react'
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
})
