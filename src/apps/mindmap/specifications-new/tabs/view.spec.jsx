import { view, viewmodel } from '~/test-utils/index'
import { MindMapApp } from '~mindmap/components-new'
import React from 'react'

test('app has tabs', () => {
  view.render(<MindMapApp />)
  view.expect.label('Tabs').toBeVisible()
})

describe('tabs', () => {
  const tabNames = ['1', '2', '3', '4']

  test('tabs are rendered from data', () => {
    const useViewmodel = viewmodel.createMock.hook({
      state: { tabs: tabNames.map((name) => ({ name })) },
    })

    view.render(<MindMapApp useViewmodel={useViewmodel} />)
    view.expect.allLabel('Tab').toHaveTextContents(tabNames)
  })

  test('tab selection', () => {
    const selectTab = viewmodel.createMock.function()
    const useViewmodel = viewmodel.createMock.hook({
      state: { tabs: tabNames.map((name) => ({ name })) },
      action: { selectTab },
    })
    view.render(<MindMapApp useViewmodel={useViewmodel} />)
    view.action.click.text('1')
    viewmodel.expect.mockFunction(selectTab).toBeCalledTimes(1)
  })
})
