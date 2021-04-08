import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { ProjectProvider } from '../Contexts/ProjectContext'
import { createMockContextProvider } from 'test-utils/react-mocks'
import { useActions } from './useActions'

test('intended use', () => {
  renderHook(useActions, {
    wrapper: ({ children }) => <ProjectProvider>{children}</ProjectProvider>,
  })
})

describe('with mock provider', () => {
  describe('undo/redo ', () => {
    test('undo', () => {
      const undo = jest.fn()
      const { result } = renderWithMockProvider({ undo })

      act(() => result.current.undoAction())

      expect(undo).toHaveBeenCalled()
    })

    test('redo', () => {
      const redo = jest.fn()
      const { result } = renderWithMockProvider({ redo })

      act(() => result.current.redoAction())

      expect(redo).toHaveBeenCalled()
    })

    test('createRootNode', () => {
      const createRootNode = jest.fn()

      const { result } = renderWithMockProvider({ createRootNode })

      act(() => result.current.createRootNode())

      expect(createRootNode).toHaveBeenCalled()
    })
  })

  function renderWithMockProvider(modifications) {
    const [ProjectContext, ProjectMockProvider] = createMockContextProvider({
      modifications,
    })

    return renderHook(() => useActions({ theProjectContext: ProjectContext }), {
      wrapper: ({ children }) => (
        <ProjectMockProvider>{children}</ProjectMockProvider>
      ),
    })
  }
})
