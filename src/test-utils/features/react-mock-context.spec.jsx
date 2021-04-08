import { renderHook, act } from '@testing-library/react-hooks'
import React, { useContext } from 'react'
import { createMockContextProvider } from '../react-mocks'
import { getActions } from '../testing-library-react-hooks'

describe('mock context and provider', () => {
  test('argumentless usage', () => {
    const [MockContext, MockProvider] = createMockContextProvider()
    const { result } = renderTest({ MockContext, MockProvider })
    expect(result.current.state).toEqual({})
  })

  test('with initial state', () => {
    const initialState = { note: 'this is a custom state' }
    const [MockContext, MockProvider] = createMockContextProvider({
      initialState,
    })

    const { result } = renderTest({ MockContext, MockProvider })
    expect(result.current.state).toEqual(initialState)
  })

  test('with modified view model', () => {
    const trigger = jest.fn()
    const [MockContext, MockProvider] = createMockContextProvider({
      modifications: { trigger },
    })

    const { result } = renderTest({ MockContext, MockProvider })
    act(() => result.current.trigger())
    expect(trigger).toHaveBeenCalled()
  })
})

function renderTest({ MockContext, MockProvider }) {
  return renderHook(() => useContext(MockContext), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  })
}
