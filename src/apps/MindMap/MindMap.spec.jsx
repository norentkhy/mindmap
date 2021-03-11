import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MindMap } from './MindMap';
import userEvent from '@testing-library/user-event';
import { queryNodeInput } from './MainView/MainView.spec';
import {
  createRootNode,
  completeNodeNaming,
  createRootNodeWithProperties,
  createChildNode,
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
});
