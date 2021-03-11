import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MindMap } from './MindMap';
import userEvent from '@testing-library/user-event';
import { foldNode, queryNodeInput } from './MainView/MainView.spec';
import {
  createRootNode,
  completeNodeNaming,
  createRootNodeWithProperties,
  createChildNode,
  createTrees,
  createChildNodeWithProperties,
  queryNode,
} from './MindMapTestUtilities';

describe('view elements', () => {
  test('tabs', () => {
    render(<MindMap />);
    screen.getByLabelText(/^tabs$/i);
  });

  test('actions', () => {
    render(<MindMap />);
    screen.getByLabelText(/^actions$/i);
  });

  test('main view', () => {
    render(<MindMap />);
    screen.getByLabelText(/^main view$/i);
  });
});

describe('tabs integration', () => {
  test('add a new tab', () => {
    render(<MindMap />);
    expect(screen.queryByText('untitled')).toBeNull();

    fireEvent.click(screen.getByLabelText('add new tab'));
    expect(screen.getByText('untitled')).toBeVisible();

    fireEvent.click(screen.getByLabelText('add new tab'));
    expect(screen.getAllByText('untitled').length).toBe(2);
  });

  test('rename a tab', () => {
    render(<MindMap />);
    fireEvent.click(screen.getByLabelText('add new tab'));
    fireEvent.doubleClick(screen.getByText('untitled'));

    const someNewTitle = 'some new title';
    userEvent.type(document.activeElement, someNewTitle);
    userEvent.type(document.activeElement, '{enter}');

    expect(screen.getByText(someNewTitle)).toBeVisible();
  });
});

describe('main view integration', () => {
  test('create a rootnode and edit its content', () => {
    render(<MindMap />);

    createRootNode();

    const InputNode = queryNodeInput();
    expect(InputNode).toBeVisible();
    expect(InputNode).toHaveFocus();

    const someNewText = 'some new text';
    completeNodeNaming(someNewText);

    expect(queryNodeInput()).toBeNull();
    expect(screen.getByText(someNewText)).toBeVisible();
  });

  test('create multiple rootnodes', () => {
    render(<MindMap />);

    const rootTexts = ['root node 1', 'root node 2'];
    rootTexts.forEach((text) => {
      createRootNodeWithProperties({ text });
      expect(screen.getByText(text)).toBeVisible();
    });
  });

  test('create a childnode', async () => {
    render(<MindMap />);
    const rootText = 'root text';
    createRootNodeWithProperties({ text: rootText });

    const ParentNode = screen.getByText(rootText);
    createChildNode(ParentNode);
    const ChildInput = queryNodeInput();
    expect(ChildInput).toBeVisible();
    await waitFor(() => {
      expect(ChildInput).toHaveFocus();
    });

    const childText = 'child text';
    completeNodeNaming(childText);

    expect(queryNodeInput()).toBeNull();
    [rootText, childText].forEach((text) => {
      expect(screen.getByText(text)).toBeVisible();
    });
  });

  test('fold a node', () => {
    render(<MindMap />);
    const texts = [
      {
        notFoldedAway: 'unaffected1',
        toFold: 'fold this1',
        foldedAway: 'folded away1',
      },
      {
        notFoldedAway: 'unaffected2',
        toFold: 'fold this2',
        foldedAway: 'folded away2',
      },
    ];
    const trees = texts.map(generateFoldTree);
    createTrees(trees);

    texts.forEach((text) => {
      expect(screen.getByText(text.foldedAway)).toBeVisible();

      const NodeToFold = screen.getByText(text.toFold);
      foldNode(NodeToFold);
      expect(screen.queryByText(text.foldedAway)).toBeNull();

      foldNode(NodeToFold);
      expect(screen.getByText(text.foldedAway)).toBeVisible();
    });

    function generateFoldTree({ notFoldedAway, toFold, foldedAway }) {
      return {
        text: notFoldedAway,
        children: [{ text: toFold, children: [{ text: foldedAway }] }],
      };
    }
  });

  test('editing node text', async () => {
    render(<MindMap />);
    const rootNode = { text: 'root node' };
    const RootNode = createRootNodeWithProperties(rootNode);

    userEvent.type(RootNode, '{enter}');
    const NodeInput = queryNodeInput();
    expect(NodeInput).toBeVisible();
    await waitFor(() => {
      expect(NodeInput).toHaveFocus();
    });

    const newText = 'some new text';
    userEvent.type(NodeInput, newText);
    userEvent.type(NodeInput, '{enter}');
    expect(queryNode({ text: newText }));
  });
});
