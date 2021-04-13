import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import useModel from '~mindmap/hooks/useModel'
import { ModelProvider } from '~mindmap/components/Model'

test('hook', () => {
  const { result } = renderHook(() => useModel(), {
    wrapper: ({ children }) => <ModelProvider>{children}</ModelProvider>,
  })

  const { state } = result.current

  expect(state).toMatchObject({})
})
