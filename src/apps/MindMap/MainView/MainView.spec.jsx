import React, { createContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MainView } from './MainView';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import { getInputSelection } from '../utils/getInputSelection';

describe('inherited from MindMap.spec', () => {
  test('label', () => {
    render(
      <MainViewMockProvider>
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );
    screen.getByLabelText(/^main view$/i);
  });
});

describe('making a rootnode', () => {
  const editNodeLabel = 'editing node';

  test('feature flag', () => {
    const createRootNode = jest.fn();

    render(
      <MainViewMockProvider
        modifyViewModel={(viewModel) => ({ ...viewModel, createRootNode })}
      >
        <MainView
          context={MainViewMockContext}
          features={{ nodeCreation: false }}
        />
      </MainViewMockProvider>
    );

    fireEvent.doubleClick(screen.getByLabelText('main view'));
    expect(createRootNode).not.toHaveBeenCalled();
  });

  test('display of rootnode', () => {
    const id = uuidv4();
    const text = 'original text';
    const initialState = { trees: [{ id, text }] };
    render(
      <MainViewMockProvider
        initialState={initialState}
        modifyViewModel={(viewModel) => ({ ...viewModel })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    expect(screen.getByText(text)).toBeVisible();
  });

  test('signal initiation to viewmodel', () => {
    const createRootNode = jest.fn();

    render(
      <MainViewMockProvider
        modifyViewModel={(viewModel) => ({ ...viewModel, createRootNode })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    expect(screen.queryByLabelText(editNodeLabel)).toBeNull();

    fireEvent.doubleClick(screen.getByLabelText('main view'));
    expect(createRootNode).toHaveBeenCalled();
  });

  test('signal end to viewmodel', () => {
    const id = uuidv4();
    const text = 'original text';
    const initialState = { trees: [{ id, text, editing: true }] };
    const finalizeEditNode = jest.fn();
    render(
      <MainViewMockProvider
        initialState={initialState}
        modifyViewModel={(viewModel) => ({ ...viewModel, finalizeEditNode })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    const InputNode = screen.getByLabelText(editNodeLabel);
    expect(InputNode).toBeVisible();
    expect(InputNode).toHaveFocus();
    expect(getInputSelection(InputNode)).toBe(text);

    const someNewText = 'some new text';
    userEvent.type(InputNode, someNewText);
    userEvent.type(InputNode, '{enter}');

    expect(finalizeEditNode).toHaveBeenCalled();
    expect(finalizeEditNode.mock.calls[0]).toEqual([{ id, text: someNewText }]);
  });
});

const MainViewMockContext = createContext();

function MainViewMockProvider({
  children,
  modifyViewModel = (x) => x,
  initialState = {},
}) {
  const viewModel = { state: initialState };
  const modifiedViewModel = modifyViewModel(viewModel);

  return (
    <MainViewMockContext.Provider value={modifiedViewModel}>
      {children}
    </MainViewMockContext.Provider>
  );
}
