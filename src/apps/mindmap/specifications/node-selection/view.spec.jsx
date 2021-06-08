import { MainView } from '~mindmap/components'
import {
  view,
  createMockFn,
  addIdTo,
  describe,
  test,
  expect,
} from '~mindmap/test-utilities'
import React from 'react'

test('select', () => {
  const node = addIdTo({
    text: 'click to select',
    do: { select: createMockFn() },
  })
  view.render(<MainView nodes={[node]} />)
  view.clickOn.node(node)
  expect(node.do.select).toBeCalledTimes(1)
})
