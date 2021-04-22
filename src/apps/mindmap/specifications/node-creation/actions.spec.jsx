import { Actions } from '~mindmap/components'
import { ui, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = viewmodel.create.mockFunction()
    renderWithMockHook({ createRootNode })
    ui.mouseAction.clickOn.menu.createRootNode()
    viewmodel.expect.mockFunction(createRootNode).toBeCalled()
  })

  function renderWithMockHook(mockHookModifications) {
    return ui.renderView({
      injectMockModelIntoJSX: ({ useMock }) => (
        <Actions useThisModel={useMock} />
      ),
      mockHookModifications,
    })
  }
})
