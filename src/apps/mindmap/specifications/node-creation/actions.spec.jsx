import { Actions } from '~mindmap/components'
import { view, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = viewmodel.create.mockFunction()
    renderWithMockHook({ createRootNode })
    view.action.mouse.clickOn.menu.createRootNode()
    viewmodel.expect.mockFunction(createRootNode).toBeCalled()
  })

  function renderWithMockHook(mockHookModifications) {
    return view.render({
      injectMockModelIntoJSX: ({ useMock }) => (
        <Actions useThisModel={useMock} />
      ),
      mockHookModifications,
    })
  }
})
