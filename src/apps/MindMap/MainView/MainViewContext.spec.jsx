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
    const { id } = result.current.state.trees[0];
    const someNewText = 'some new text';

    act(() => result.current.finalizeEditNode({ id, text: someNewText }));
    expect(result.current.state.trees[0].text).toBe(someNewText);
  });
});
