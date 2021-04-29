import { MainView } from '~mindmap/components'
import { view, viewmodel } from '~mindmap/test-utilities'
import React from 'react'

describe('dimensions of each node', () => {
  test('offsets given to each roottree', () => {
    const offsetLeft = 10
    const offsetTop = 11
    const node = viewmodel.create.node({
      text: 'offset test',
      desiredTreeCss: { offsetLeft, offsetTop },
    })
    renderTest({
      initialState: viewmodel.create.state({
        rootNodes: [node],
      }),
    })

    view.expect.rootTree(node).toHaveStyle({
      position: 'absolute',
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
    })
  })
})

describe('call to update sizes of', () => {
  test('mindspace', () => {
    const registerSurfaceLayout = viewmodel.create.mockFunction()
    const { fireResizeEvent } = renderTest({
      modifications: { registerSurfaceLayout },
    })
    const MindSpace = view.query.mindSpace()
    fireResizeEvent(MindSpace, {})

    viewmodel.expect.mockFunction(registerSurfaceLayout).toBeCalledTimes(2)
  })

  test('root tree', () => {
    const text = 'this has a root tree'
    const registerTreeLayout = viewmodel.create.mockFunction()
    const { fireResizeEvent } = renderTest({
      initialState: viewmodel.create.state({
        rootNodes: [viewmodel.create.node({ text })],
      }),
      modifications: { registerTreeLayout },
    })
    const RootTree = view.query.rootTree({ text })
    fireResizeEvent(RootTree, {})

    viewmodel.expect.mockFunction(registerTreeLayout).toBeCalledTimes(2)
  })
})

function renderTest(
  { initialState = {}, modifications = {} } = {
    initialState: {},
    modifications: {},
  }
) {
  return view.render({
    injectMockModelIntoJSX: ({ useMock }) => (
      <MainView useThisModel={useMock} />
    ),
    initialState,
    mockHookModifications: modifications,
  })
}
