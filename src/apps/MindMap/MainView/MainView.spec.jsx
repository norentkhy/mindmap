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

  test('display of multiple rootnodes', () => {
    const rootNode1 = { id: uuidv4(), text: '1' };
    const rootNode2 = { id: uuidv4(), text: '2' };
    const initialState = { trees: [rootNode1, rootNode2] };
    render(
      <MainViewMockProvider
        initialState={initialState}
        modifyViewModel={(viewModel) => ({ ...viewModel })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    expect(screen.getByText(rootNode1.text)).toBeVisible();
    expect(screen.getByText(rootNode2.text)).toBeVisible();
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

describe('folding a node', () => {
  test('display of a folded node', () => {
    const FoldedNode = { id: uuidv4(), text: 'fold this' };
    const InvisibleNode = { id: uuidv4(), text: 'folded away' };
    const initialState = {
      trees: [{ ...FoldedNode, folded: true, children: [InvisibleNode] }],
    };
    render(
      <MainViewMockProvider initialState={initialState}>
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    expect(screen.getByText(FoldedNode.text)).toBeVisible();
    expect(screen.queryByText(InvisibleNode.text)).toBeNull();
  });

  test('fold call to view model', () => {
    const NodeToFold = { id: uuidv4(), text: 'fold this' };
    const initialState = {
      trees: [NodeToFold],
    };
    const foldNode = jest.fn();
    render(
      <MainViewMockProvider
        initialState={initialState}
        modifyViewModel={(viewModel) => ({ ...viewModel, foldNode })}
      >
        <MainView context={MainViewMockContext} />
      </MainViewMockProvider>
    );

    userEvent.type(screen.getByText(NodeToFold.text), 'f');
    expect(foldNode).toHaveBeenCalled();
    expect(foldNode.mock.calls[0]).toEqual([NodeToFold.id]);
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

function queryNodeInput() {
  return screen.queryByLabelText('editing node');
}

function foldNode(Node) {
  userEvent.type(Node, 'f');
}

export { queryNodeInput, foldNode };
