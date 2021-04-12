import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'
import { TabsProvider } from './TabsContext'

describe('rendered as intended', () => {
  test('overlap with MindMap.spec', () => {
    renderAsIntended()
    expect(queryByLabelText(/^tabs$/i)).toBeVisible()
  })

  function renderAsIntended() {
    render(
      <TabsProvider>
        <Tabs />
      </TabsProvider>
    )
  }
})

function queryByLabelText(stringOrRegExp) {
  return screen.queryByLabelText(stringOrRegExp)
}
