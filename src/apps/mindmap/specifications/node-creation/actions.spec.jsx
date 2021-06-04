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
  test('node creation', () => {
    const createNode = createMockFn()
    view.render(<Actions actions={{ createNode }} />)
    view.clickOn.createRootNodeButton()
    expect(createNode).toBeCalled()
  })
})
