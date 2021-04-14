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

  function renderWithMockHook(hookModifications) {
    return ui.render(<Actions useThisModel={useMock} />)

    function useMock() {
      return {
        undoAction() {},
        redoAction() {},
        createRootNode() {},
        ...hookModifications,
      }
    }
  }
})
