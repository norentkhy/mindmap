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

test('handle drag events', () => {
  const node = addIdTo({
    text: 'drag this',
    do: { handleDragStart: createMockFn() },
  })
  const handleNodeDrop = createMockFn()
  view.render(<MainView nodes={[node]} handleNodeDrop={handleNodeDrop} />)

  view.dragStart.node(node)
  const expectedDragStartArgs = [expect.any(Object), expect.anything()]
  expect(node.do.handleDragStart).nthCalledWith(1, ...expectedDragStartArgs)

  view.drop.nodeSpace()
  expect(handleNodeDrop).toBeCalledTimes(1, expect.any(Object))
})

test('cursor/pointer should remain the same', () => {
  const node = addIdTo({ text: 'hi', do: { handleDragStart: createMockFn() } })
  view.render(<MainView nodes={[node]} />)
  view.dragStart.node(node)

  expect(node.do.handleDragStart).nthCalledWith(
    1,
    expect.objectContaining({
      dataTransfer: expect.objectContaining({ effectAllowed: 'move' }),
    }),
    expect.anything()
  )
})
