import { MainView } from 'src/components'
import {
  view,
  addIdTo,
  createMockFn,
  describe,
  test,
  expect,
} from 'src/test-utils'
import React from 'react'

describe('node folding: view', () => {
  test('display a folded node', () => {
    const foldedNode = addIdTo({ text: 'this is folded', folded: true })
    // child of node is not in model, because parent is folded
    view.render(<MainView nodes={[foldedNode]} />)
    view.expect.node(foldedNode).toBeVisible()
  })

  test('fold call to view model', () => {
    const foldTarget = addIdTo({
      text: 'fold this',
      do: { toggleFold: createMockFn() },
    })
    view.render(<MainView nodes={[foldTarget]} />)
    view.clickOn.node(foldTarget)
    view.withKeyboard('press', 'f')

    expect(foldTarget.do.toggleFold).toBeCalledTimes(1)
  })
})
