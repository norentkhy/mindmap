import { useActions } from '~mindmap/components/Actions/useActions'
import { createMockContextProvider } from 'test-utils/react-mocks'

import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

describe('undo redo: with mock provider', () => {
  describe('actions viewmodel', () => {
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
