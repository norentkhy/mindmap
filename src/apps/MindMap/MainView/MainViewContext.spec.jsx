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

  test('receive command to finalize editing', () => {
    const wrapper = ({ children }) => (
      <MainViewProvider>{children}</MainViewProvider>
    );
    const { result } = renderHook(() => useContext(MainViewContext), {
      wrapper,
    });

    act(() => result.current.createRootNode());
    const { id } = getRootNode(result);
    const someNewText = 'some new text';

    act(() => result.current.finalizeEditNode({ id, text: someNewText }));
    expect(getRootNode(result).text).toBe(someNewText);
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
    const parentNode = getRootNode(result);
    act(() =>
      result.current.finalizeEditNode({
        id: parentNode.id,
        text: 'root node',
      })
    );

    act(() => result.current.createChildNode(parentNode.id));
  });
});

function getRootNode(result) {
  return result.current.state.trees[0];
}
