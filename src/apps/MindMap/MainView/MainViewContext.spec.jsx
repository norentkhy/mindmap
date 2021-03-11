import { renderHook, act } from '@testing-library/react-hooks';
import React, { useContext } from 'react';
import { MainViewProvider, MainViewContext } from './MainViewContext';

describe('create a root node', () => {
  test('create root node and set it to edit mode', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });

    expect(result.current.state.trees).toEqual([]);

    act(() => result.current.createRootNode());
    expect(result.current.state.trees.length).toBe(1);

    const node = result.current.state.trees[0];
    expect(node.text).toBe('');
    expect(node.editing).toBe(true);
    expect(node.id).toBeTruthy();
  });

  test('receive command to initiate editing', () => {
    const { result } = renderUseMainViewContext();
    const initialText = 'initial';
    const id = createRootNodeWithProperties(result, { text: initialText });

    act(() => result.current.initiateEditNode(id));

    expect(getNewestRootNode(result).editing).toBe(true);
  });

  test('receive command to finalize editing', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });

    act(() => result.current.createRootNode());
    const { id } = getNewestRootNode(result);
    const someNewText = 'some new text';

    act(() => result.current.finalizeEditNode({ id, text: someNewText }));
    expect(getNewestRootNode(result).text).toBe(someNewText);
  });

  test('make multiple rootnodes', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });

    const nodeTexts = ['root1', 'root2'];
    nodeTexts.forEach((text) => {
      createRootNodeWithProperties(result, { text });
      expect(getNewestRootNode(result)).toMatchObject({ text });
    });
  });
});

describe('create a child node', () => {
  test('create a child node and set it to edit mode', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });
    act(() => result.current.createRootNode());
    const parentNode = getNewestRootNode(result);
    act(() =>
      result.current.finalizeEditNode({
        id: parentNode.id,
        text: 'root node',
      })
    );

    act(() => result.current.createChildNode(parentNode.id));
  });
});

describe('fold a node', () => {
  test('fold a node', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });
    createRootNodeWithProperties(result, { text: 'root node' });

    const initialNode = getNewestRootNode(result);
    const { id } = initialNode;
    expect(initialNode.folded).toBeFalsy();

    act(() => result.current.foldNode(id));

    const foldedNode = getNewestRootNode(result);
    expect(foldedNode.folded).toBe(true);

    act(() => result.current.foldNode(id));

    const unfoldedNode = getNewestRootNode(result);
    expect(unfoldedNode.folded).toBe(false);
  });
});

function renderUseMainViewContext() {
  const wrapper = ({ children }) => (
    <MainViewProvider>{children}</MainViewProvider>
  );
  return renderHook(() => useContext(MainViewContext), {
    wrapper,
  });
}

function createRootNodeWithProperties(result, { text, ...others }) {
  act(() => result.current.createRootNode());
  const { id } = getNewestRootNode(result);
  act(() => result.current.finalizeEditNode({ id, text, ...others }));
  return id;
}

function getRootNodes(result) {
  return result.current.state.trees;
}

function getNewestRootNode(result) {
  const rootNodes = getRootNodes(result);
  return rootNodes[rootNodes.length - 1];
}
