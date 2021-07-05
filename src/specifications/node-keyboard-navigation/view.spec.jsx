import {
  view,
  createMockFn,
  describe,
  test,
  expect,
  addIdTo,
} from 'src/test-utils'
import React from 'react'
import { MainView } from 'src/components'
import { repeat } from 'src/utils/FunctionalProgramming'

describe('mindboard placement', () => {
  test.each(['left', 'right', 'up', 'down'])(
    'handles click event with coordinates',
    (direction) => {
      const node = addIdTo({ text: 'node', focused: true })
      const navigate = createMockFn()
      view.render(<MainView nodes={[node]} navigate={navigate} />)
      view.expect.node(node).toHaveFocus()

      view.pressKeyDown(direction)
      expect(navigate).nthCalledWith(1, direction)
    }
  )

  test('behaviour when holding down a key', () => {
    const node = addIdTo({ text: 'node', focused: true })
    const navigate = createMockFn()
    view.render(<MainView nodes={[node]} navigate={navigate} />)
    view.expect.node(node).toHaveFocus()

    repeat(5, () => view.pressKeyDown('left'))
    view.pressKeyUp('left')
    expect(navigate).nthCalledWith(5, 'left')
  })
})
