import { fireEvent, render, screen } from '@testing-library/react'
import { Actions } from '~mindmap/components/Actions/Actions'

import * as TLRH from '@testing-library/react-hooks'
import { createMockContextProvider } from 'test-utils/react-mocks'
import { useActions } from '~mindmap/components/Actions/useActions'

import React from 'react'

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = jest.fn()
    renderWithMockHook({ createRootNode })

    ui.createRootNode()

    expect(createRootNode).toHaveBeenCalled()
  })

  function renderWithMockHook(hookModifications) {
    return render(<Actions useHook={useMock} />)

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

const ui = {
  undo() {
    const Button = getButton('undo action')
    click(Button)
  },
  redo() {
    const Button = getButton('redo action')
    click(Button)
  },
  createRootNode() {
    const Button = getButton('create root node')
    click(Button)
  },
}

function getButton(labeltext) {
  return screen.getByLabelText(labeltext)
}

function click(Element) {
  fireEvent.click(Element)
}

describe('with mock provider', () => {
  describe('undo/redo ', () => {
    test('createRootNode', () => {
      const createRootNode = jest.fn()

      const { result } = renderWithMockProvider({ createRootNode })

      TLRH.act(() => result.current.createRootNode())

      expect(createRootNode).toHaveBeenCalled()
    })
  })

  function renderWithMockProvider(modifications) {
    const [ProjectContext, ProjectMockProvider] = createMockContextProvider({
      modifications,
    })

    return TLRH.renderHook(
      () => useActions({ theProjectContext: ProjectContext }),
      {
        wrapper: ({ children }) => (
          <ProjectMockProvider>{children}</ProjectMockProvider>
        ),
      }
    )
  }
})
