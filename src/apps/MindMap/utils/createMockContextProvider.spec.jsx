import { renderHook, act } from '@testing-library/react-hooks';
import React, { useContext } from 'react';
import { createMockContextProvider } from './createMockContextProvider';

describe('mock context and provider', () => {
  test('argumentless usage', () => {
    const [MockContext, MockProvider] = createMockContextProvider();

    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current).toEqual({ state: {} });
  });

  test('with initial state', () => {
    const initialState = { note: 'this is a custom state' };
    const [MockContext, MockProvider] = createMockContextProvider({
      initialState,
    });

    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current).toEqual({ state: initialState });
  });

  test('with modified view model', () => {
    const trigger = jest.fn();
    const [MockContext, MockProvider] = createMockContextProvider({
      modifications: { trigger },
    });

    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    act(() => result.current.trigger());
    expect(trigger).toHaveBeenCalled();
  });
});
