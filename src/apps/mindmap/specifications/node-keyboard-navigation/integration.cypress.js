import {
  clickOnElementWithText,
  doubleClickToCreateNode,
  expectFocusedToHaveText,
  pressOnKeyboard,
  typeOnKeyboard,
  visitMindmapApp,
} from '~mindmap/test-utilities/cypress'

export default function testNodePlacement(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  describe('two node grids', () => {
    it('2 nodes: go from right to left', () => {
      createNodes(cy, [
        { text: 'left node', left: 0.3, top: 0.5 },
        { text: 'right node', left: 0.7, top: 0.5, focused: true },
      ])
      pressOnKeyboard(cy, 'left')
      expectFocusedToHaveText(cy, 'left node')
    })

    it('2 nodes: go from right to left', () => {
      createNodes(cy, [
        { text: 'left node', left: 0.3, top: 0.5 },
        { text: 'right node', left: 0.7, top: 0.5, focused: true },
      ])
      pressOnKeyboard(cy, 'right')
      expectFocusedToHaveText(cy, 'right node')
    })

    it('2 nodes: go from up to down', () => {
      createNodes(cy, [
        { text: 'down node', left: 0.5, top: 0.7 },
        { text: 'up node', left: 0.5, top: 0.3, focused: true },
      ])
      pressOnKeyboard(cy, 'down')
      expectFocusedToHaveText(cy, 'down node')
    })

    it('2 nodes: go from down to up', () => {
      createNodes(cy, [
        { text: 'up node', left: 0.5, top: 0.3 },
        { text: 'down node', left: 0.5, top: 0.7, focused: true },
      ])
      pressOnKeyboard(cy, 'up')
      expectFocusedToHaveText(cy, 'up node')
    })
  })

  describe('four node grids', () => {
    it('4 nodes: go from down to down', () => {
      createNodes(cy, [
        { text: 'up node', left: 0.5, top: 0.3, focused: true },
        { text: 'down node', left: 0.5, top: 0.7 },
        { text: 'left node', left: 0.3, top: 0.5 },
        { text: 'right node', left: 0.7, top: 0.5 },
      ])
      pressOnKeyboard(cy, 'up')
      expectFocusedToHaveText(cy, 'up node')
      
      pressOnKeyboard(cy, 'left')
      expectFocusedToHaveText(cy, 'left node')

      pressOnKeyboard(cy, 'down')
      expectFocusedToHaveText(cy, 'down node')

      pressOnKeyboard(cy, 'right')
      expectFocusedToHaveText(cy, 'right node')

      pressOnKeyboard(cy, 'up')
      expectFocusedToHaveText(cy, 'up node')
    })
  })

}

function createNodes(cy, nodes) {
  nodes.forEach(({ text, left, top }) => {
    doubleClickToCreateNode(cy, left, top, text)
    typeOnKeyboard(cy, text)
    pressOnKeyboard(cy, 'enter')
  })
  const nodeToFocus = nodes.find(node => node.focused)
  clickOnElementWithText(cy, nodeToFocus.text)
}
