import { MainView } from '~mindmap/components'
import { ui, model } from '~mindmap/test-utilities'
import React from 'react'

describe('dimensions of each node', () => {
  test('offsets given to each roottree', () => {
    const offsetLeft = 10
    const offsetTop = 11
    const node = model.create.node({
      text: 'offset test',
      desiredTreeCss: { offsetLeft, offsetTop },
    })
    renderTest({
      initialState: model.create.state({
        rootNodes: [node],
      }),
    })

    ui.expect.rootTree(node).toHaveStyle({
      position: 'absolute',
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
    })
  })
})

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  const { rendered } = ui.renderView({
    injectMockModelIntoJSX: ({ useMock }) => (
      <MainView useThisModel={useMock} />
    ),
    initialState,
    mockHookModifications: modifications,
  })

  return rendered
}
