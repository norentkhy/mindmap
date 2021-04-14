import { MainView } from '~mindmap/components'
import { ui, createDataStructure } from '~mindmap/test-utilities/view'
import React from 'react'

describe('dimensions of each node', () => {
  test('offsets given to each roottree', () => {
    const offsetLeft = 10
    const offsetTop = 11
    const node = createDataStructure.node({
      text: 'offset test',
      desiredTreeCss: { offsetLeft, offsetTop },
    })
    renderTest({
      initialState: createDataStructure.state({
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
  return ui.render(<MainView useThisModel={useMock} />)

  function useMock() {
    return {
      state: initialState,
      useThisResizeObserver() {},
      registerNodeLayout() {},
      registerTreeLayout() {},
      adjustRootTree() {},
      ...modifications,
    }
  }
}
