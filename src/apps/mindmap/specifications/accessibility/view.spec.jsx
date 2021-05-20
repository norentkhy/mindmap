import { Actions, MainView, Tabs } from '~mindmap/components'
import { view } from '~mindmap/test-utilities/view'
import { render } from '@testing-library/react'
import { createMockContextProvider } from 'test-utils/react-mocks'
import React from 'react'

describe('accessibility: view components', () => {
  const [MockContext, MockProvider] = createMockContextProvider({
    modifications: {
      useThisResizeObserver() {},
    },
  })

  test('tabs', () => {
    view.render({ JSX: <Tabs tabs={[]} /> })
    view.expect.byLabel('tabs').toBeVisible()
  })

  test('main view', () => {
    view.render({
      injectMockModelIntoJSX: ({ useMock }) => (
        <MainView useThisModel={useMock} />
      ),
    })
    view.expect.byLabel('main view').toBeVisible()
  })

  test('actions', () => {
    render(<Actions actions={{}} />)
    view.expect.byLabel('actions').toBeVisible()
  })
})
