import { renderHook, act } from '@testing-library/react-hooks';
import React, { createContext, useContext } from 'react';

describe('mock context and provider', () => {
  test('argumentless usage', () => {
    const [MockContext, MockProvider] = createMockContextProvider();

    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    });

    expect(result.current).toEqual({ state: {} });
  });

  test('with initial state', () => {
    const [MockContext, MockProvider] = createMockContextProvider();

    const initialState = { note: 'this is a custom state' };
    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => (
        <MockProvider initialState={initialState}>{children}</MockProvider>
      ),
    });

    expect(result.current).toEqual({ state: initialState });
  });

  test('with modified view model', () => {
    const [MockContext, MockProvider] = createMockContextProvider();

    const viewModelModifications = {
      trigger: jest.fn(),
    };
    const { result } = renderHook(() => useContext(MockContext), {
      wrapper: ({ children }) => (
        <MockProvider viewModelModifications={viewModelModifications}>
          {children}
        </MockProvider>
      ),
    });

    act(() => result.current.trigger());
    expect(viewModelModifications.trigger).toHaveBeenCalled();
  });
});
export function createMockContextProvider() {
  const Context = createContext();

  return [Context, Provider];

  function Provider({
    children,
    initialState = {},
    viewModelModifications = {},
  }) {
    const viewModel = { state: initialState };
    const modifiedViewModel = { ...viewModel, ...viewModelModifications };

    return (
      <Context.Provider value={modifiedViewModel}>{children}</Context.Provider>
    );
  }
}
