import React, { createContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MainView } from './MainView';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import { getInputSelection } from '../utils/getInputSelection';

const editNodeLabel = 'editing node';

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

describe('adding a child node', () => {
  test('press t while focusing node to call createChildNode', () => {
    const id = uuidv4();
    const text = 'root node';
    const initialState = { trees: [{ id, text }] };
    const createChildNode = jest.fn();
    render(
      <MainViewMockProvider
        initialState={initialState}
        modifyViewModel={(viewModel) => ({ ...viewModel, createChildNode })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    userEvent.type(screen.getByText(text), 'c');
    expect(createChildNode).toHaveBeenCalled();
    expect(createChildNode.mock.calls[0]).toEqual([id]);
  });

  test('signal end to viewmodel', () => {
    const childNode = { id: uuidv4(), text: 'child', editing: true };
    const initialState = {
      trees: [{ id: uuidv4(), text: 'parent', children: [childNode] }],
    };
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
    expect(getInputSelection(InputNode)).toBe(childNode.text);

    const someNewText = 'some new text';
    userEvent.type(InputNode, someNewText);
    userEvent.type(InputNode, '{enter}');

    expect(finalizeEditNode).toHaveBeenCalled();
    expect(finalizeEditNode.mock.calls[0]).toEqual([
      { id: childNode.id, text: someNewText },
    ]);
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

export function queryNodeInput() {
  return screen.queryByLabelText('editing node');
}
