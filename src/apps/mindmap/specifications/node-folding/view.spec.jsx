import { MainView } from '~mindmap/components'
import { view, viewmodel, addIdTo, render } from '~mindmap/test-utilities'
import React from 'react'

describe('node folding: view', () => {
  test('display a folded node', () => {
    const foldedNode = addIdTo({ text: 'this is folded', folded: true })
    // child of node is not in model, because parent is folded
    render(<MainView nodes={[foldedNode]} />)
    view.expect.node(foldedNode).toBeVisible()
  })

  test('fold call to view model', () => {
    const foldTarget = addIdTo({
      text: 'fold this',
      do: { toggleFold: viewmodel.create.mockFunction() },
    })
    render(<MainView nodes={[foldTarget]} />)
    view.action.mouse.clickOn.node(foldTarget)
    view.action.keyboard.foldSelectedNode()

    viewmodel.expect.mockFunction(foldTarget.do.toggleFold).toBeCalledTimes(1)
  })
})
