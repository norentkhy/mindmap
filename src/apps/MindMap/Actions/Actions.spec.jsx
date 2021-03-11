import React, { createContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Actions } from './Actions';
import { MainViewProvider } from '../MainView/MainViewContext';

describe('inherited from MindMap.spec', () => {
  test('label: actions', () => {
    render(
      <MainViewProvider>
        <Actions />
      </MainViewProvider>
    );
    screen.getByLabelText(/^actions$/i);
  });
});

describe('with mock providers', () => {
  describe('node creation', () => {
    test('mocked', () => {
      const createRootNode = jest.fn();
      renderWithMockHook({ createRootNode });

      const CreateRootNodeButton = getButton.CreateRootNode();
      fireEvent.click(CreateRootNodeButton);

      expect(createRootNode).toHaveBeenCalled();
    });
  });

  describe('undo/redo action', () => {
    describe('mocked ActionsContext', () => {
      test('undo', () => {
        const undoAction = jest.fn();
        renderWithMockHook({ undoAction });

        const UndoButton = getButton.Undo();
        fireEvent.click(UndoButton);

        expect(undoAction).toHaveBeenCalled();
        expect(undoAction.mock.calls[0]).toEqual([]);
      });

      test('redo', () => {
        const redoAction = jest.fn();
        renderWithMockHook({ redoAction });

        const RedoButton = getButton.Redo();
        fireEvent.click(RedoButton);

        expect(redoAction).toHaveBeenCalled();
        expect(redoAction.mock.calls[0]).toEqual([]);
      });
    });
  });

  function renderWithMockHook(hookModifications) {
    return render(<Actions useHook={useMock} />);

    function useMock() {
      return {
        undoAction() {},
        redoAction() {},
        createRootNode() {},
        ...hookModifications,
      };
    }
  }
});

const getButton = {
  Undo() {
    return screen.getByLabelText('undo action');
  },
  Redo() {
    return screen.getByLabelText('redo action');
  },
  CreateRootNode() {
    return screen.getByLabelText('create root node');
  },
};
