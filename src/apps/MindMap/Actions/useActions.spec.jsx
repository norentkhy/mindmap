import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { MainViewProvider } from '../MainView/MainViewContext';
import { createMockContextProvider } from '../utils/createMockContextProvider';
import { useActions } from './useActions';

test('intended use', () => {
  renderHook(useActions, {
    wrapper: ({ children }) => <MainViewProvider>{children}</MainViewProvider>,
  });
});

describe('with mock provider', () => {
  describe('undo/redo ', () => {
    test('undo', () => {
      const undo = jest.fn();
      const { result } = renderWithMockProvider({ undo });

      act(() => result.current.undoAction());

      expect(undo).toHaveBeenCalled();
    });

    test('redo', () => {
      const redo = jest.fn();
      const { result } = renderWithMockProvider({ redo });

      act(() => result.current.redoAction());

      expect(redo).toHaveBeenCalled();
    });

    test('createRootNode', () => {
      const createRootNode = jest.fn();

      const { result } = renderWithMockProvider({ createRootNode });

      act(() => result.current.createRootNode());

      expect(createRootNode).toHaveBeenCalled();
    });
  });

  function renderWithMockProvider(contextModifications) {
    const [
      MainViewMockContext,
      MainViewMockProvider,
    ] = createMockContextProvider();

    return renderHook(
      () => useActions({ MainViewContext: MainViewMockContext }),
      {
        wrapper: ({ children }) => (
          <MainViewMockProvider viewModelModifications={contextModifications}>
            {children}
          </MainViewMockProvider>
        ),
      }
    );
  }
});
