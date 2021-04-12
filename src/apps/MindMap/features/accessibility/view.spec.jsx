import { Actions } from '~mindmap/components/Actions/Actions'
import { MainView } from '~mindmap/components/MainView/MainView'
import { Tabs } from '~mindmap/components/Tabs/Tabs'
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
    render(
      <MockProvider>
        <MainView theProjectContext={MockContext} />
      </MockProvider>
    )
    expectLabelToBeVisible('main view')
  })

  test('actions', () => {
    render(
      <MockProvider>
        <Actions theProjectContext={MockContext} />
      </MockProvider>
    )
    expectLabelToBeVisible('actions')
  })
})

function expectLabelToBeVisible(stringOrRegExp) {
  expect(screen.getByLabelText(stringOrRegExp)).toBeVisible()
}
