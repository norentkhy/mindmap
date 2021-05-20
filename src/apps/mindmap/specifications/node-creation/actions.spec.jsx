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
    const createRootNode = createMockFn()
    view.render(<Actions actions={{ createRootNode }} />)
    view.clickOn.createRootNodeButton()
    expect(createRootNode).toBeCalled()
  })
})
