import {
  view,
  createMockFn,
  describe,
  test,
  expect,
  addIdTo,
} from '~mindmap/test-utilities'
import React from 'react'
import { MainView } from '~mindmap/components'

test('handle drag events', () => {
  const node = addIdTo({
    text: 'drag this',
    do: { handleDragStart: createMockFn(), handleDragEnd: createMockFn() },
  })
  view.render(<MainView nodes={[node]} />)

  view.dragStart.node(node)
  expect(node.do.handleDragStart).nthCalledWith(1, expect.any(Object))

  view.dragEnd.node(node)
  expect(node.do.handleDragEnd).toBeCalledTimes(1, expect.any(Object))
})

test('cursor/pointer should remain the same', () => {
  const node = addIdTo({
    text: 'check event',
    do: { handleDragStart: createMockFn() },
  })
  view.render(<MainView nodes={[node]} />)
  view.dragStart.node(node)
  expect(node.do.handleDragStart).nthCalledWith(
    1,
    expect.objectContaining({
      dataTransfer: expect.objectContaining({
        effectAllowed: 'move',
      }),
    })
  )
})
