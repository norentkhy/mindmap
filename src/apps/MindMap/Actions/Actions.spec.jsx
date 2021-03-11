import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Actions } from './Actions';
import { ProjectProvider } from '../Contexts/ProjectContext';

describe('inherited from MindMap.spec', () => {
  test('label: actions', () => {
    renderAsIntended();
    screen.getByLabelText(/^actions$/i);
  });

  function renderAsIntended() {
    return render(
      <ProjectProvider>
        <Actions />
      </ProjectProvider>
    );
  }
});

describe('with mock providers', () => {
  test('node creation', () => {
    const createRootNode = jest.fn();
    renderWithMockHook({ createRootNode });

    ui.createRootNode();

    expect(createRootNode).toHaveBeenCalled();
  });

  test('undo', () => {
    const undoAction = jest.fn();
    renderWithMockHook({ undoAction });

    ui.undo();

    expect(undoAction).toHaveBeenCalled();
    expect(undoAction.mock.calls[0]).toEqual([]);
  });

  test('redo', () => {
    const redoAction = jest.fn();
    renderWithMockHook({ redoAction });

    ui.redo();

    expect(redoAction).toHaveBeenCalled();
    expect(redoAction.mock.calls[0]).toEqual([]);
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

const ui = {
  undo() {
    const Button = getButton('undo action');
    click(Button);
  },
  redo() {
    const Button = getButton('redo action');
    click(Button);
  },
  createRootNode() {
    const Button = getButton('create root node');
    click(Button);
  },
};

function getButton(labeltext) {
  return screen.getByLabelText(labeltext);
}

function click(Element) {
  fireEvent.click(Element);
}
