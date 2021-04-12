import React from 'react'
import { render, screen } from '@testing-library/react'
import { MainView } from './MainView'
import { createMockContextProvider } from 'test-utils/react-mocks'
import 'jest-styled-components'

describe('inherited from MindMap.spec', () => {
  test('label', () => {
    renderTest()
    screen.getByLabelText(/^main view$/i)
  })
})

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  const [MockContext, MockProvider] = createMockContextProvider({
    initialState,
    modifications: {
      useThisResizeObserver() {},
      registerNodeLayout() {},
      registerTreeLayout() {},
      adjustRootTree() {},
      ...modifications,
    },
  })

  return render(
    <MockProvider>
      <MainView theProjectContext={MockContext} />
    </MockProvider>
  )
}
