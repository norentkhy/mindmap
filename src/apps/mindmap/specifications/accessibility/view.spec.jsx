import { Actions, MainView, Tabs } from '~mindmap/components'
import { createMockContextProvider } from 'test-utils/react-mocks'

import React from 'react'
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

describe('accessibility: view components', () => {
  const [MockContext, MockProvider] = createMockContextProvider({
    modifications: {
      useThisResizeObserver() {},
    },
  })

  test('tabs', () => {
    render(
      <MockProvider>
        <Tabs theTabsContext={MockContext} />
      </MockProvider>
    )
    expectLabelToBeVisible('tabs')
  })

  test('main view', () => {
    render(<MainView useThisModel={useMock} />)
    expectLabelToBeVisible('main view')
  })

  test('actions', () => {
    render(<Actions useThisModel={useMock} />)
    expectLabelToBeVisible('actions')
  })

  function useMock() {
    return {
      useThisResizeObserver() {},
    }
  }
})

function expectLabelToBeVisible(stringOrRegExp) {
  expect(screen.getByLabelText(stringOrRegExp)).toBeVisible()
}
