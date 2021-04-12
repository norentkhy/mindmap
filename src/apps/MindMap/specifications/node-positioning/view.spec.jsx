import React from 'react'
import { render } from '@testing-library/react'
import { MainView } from '~mindmap/components/MainView/MainView'
import { createDataStructure, queryNode } from '~mindmap/test-utilities/view'
import { createMockContextProvider } from 'test-utils/react-mocks'
import 'jest-styled-components'

describe('dimensions of each node', () => {
  test('offsets given to each roottree', () => {
    const offsetLeft = 10
    const offsetTop = 11
    renderTest({
      initialState: createDataStructure.state({
        rootNodes: [
          createDataStructure.node({
            text: 'offset test',
            desiredTreeCss: { offsetLeft, offsetTop },
          }),
        ],
      }),
    })

    const Node = queryNode({ text: 'offset test' })
    const RootContainer = getRootContainer(Node)

    expect(RootContainer).toHaveStyleRule('position', 'absolute')
    expect(RootContainer).toHaveStyleRule('left', `${offsetLeft}px`)
    expect(RootContainer).toHaveStyleRule('top', `${offsetTop}px`)
  })

  function getRootContainer(Node) {
    const ParentElement = Node.parentElement
    if (!ParentElement) throw new Error('no root container')
    if (ParentElement.getAttribute('aria-label') === 'container of rootnode')
      return ParentElement
    else return getRootContainer(ParentElement)
  }
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
