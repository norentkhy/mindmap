import { Actions } from '~mindmap/components'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = jest.fn()
    renderWithMockHook({ createRootNode })

    ui.mouseAction.clickOn.menu.createRootNode()

    expect(createRootNode).toHaveBeenCalled()
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
