import { Actions } from '~mindmap/components'
import { view, viewmodel } from '~mindmap/test-utilities'
import { render } from '@testing-library/react'
import React from 'react'

describe('actions', () => {
  test('node creation', () => {
    const createRootNode = viewmodel.create.mockFunction()
    render(<Actions actions={{ createRootNode }} />)
    view.action.mouse.clickOn.menu.createRootNode()
    viewmodel.expect.mockFunction(createRootNode).toBeCalled()
  })
})
