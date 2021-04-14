import { Actions, MainView, Tabs } from '~mindmap/components'
import { ui } from '~mindmap/test-utilities/view'
import { createMockContextProvider } from 'test-utils/react-mocks'

import React from 'react'
import 'jest-styled-components'

describe('accessibility: view components', () => {
  const [MockContext, MockProvider] = createMockContextProvider({
    modifications: {
      useThisResizeObserver() {},
    },
  })

  test('tabs', () => {
    ui.render(
      <MockProvider>
        <Tabs theTabsContext={MockContext} />
      </MockProvider>
    )
    ui.expect.byLabel('tabs').toBeVisible()
  })

  test('main view', () => {
    ui.render(<MainView useThisModel={useMock} />)
    ui.expect.byLabel('main view').toBeVisible()
  })

  test('actions', () => {
    ui.render(<Actions useThisModel={useMock} />)
    ui.expect.byLabel('actions').toBeVisible()
  })

  function useMock() {
    return {
      useThisResizeObserver() {},
    }
  }
})
