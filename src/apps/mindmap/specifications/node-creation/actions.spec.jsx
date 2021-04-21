import { Actions } from '~mindmap/components'
import { ui, model } from '~mindmap/test-utilities'
import React from 'react'

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = model.create.mockFunction()
    renderWithMockHook({ createRootNode })
    ui.mouseAction.clickOn.menu.createRootNode()
    model.expect.mockFunction(createRootNode).toBeCalled()
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
