import {
  clickButtonToCreateNode,
  createRootNodeWithName,
  doubleClickToCreateNode,
  expectFocusedToContainText,
  expectToFindMultipleNodes,
  expectToFindNode,
  expectToFindNodeInput,
  pressOnKeyboard,
  typeOnKeyboard,
  visitMindmapApp,
} from '~mindmap/test-utilities/cypress'

export default function testNodeCreation(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  describe('methods of root node creation', () => {
    ;[doubleClickToCreateNode, clickButtonToCreateNode].forEach(
      (createRootNode) => {
        it(`${createRootNode.name}`, () => {
          createRootNode(cy)

          expectToFindNode(cy)
          expectToFindNodeInput(cy)
        })
      }
    )
  })

  describe('editing a node', () => {
    const nodeName = 'this is a name'

    it('complete node naming after root node creation', () => {
      clickButtonToCreateNode(cy)

      typeOnKeyboard(cy, nodeName)
      pressOnKeyboard(cy, 'enter')

      expectFocusedToContainText(cy, nodeName)
      expectToFindNodeInput(cy, false)
    })

    it('edit a node that already has a name', () => {
      createRootNodeWithName(cy, nodeName)
      pressOnKeyboard(cy, 'enter')

      expectToFindNodeInput(cy)
    })
  })

  describe('creating a child node', () => {
    const nodeName = 'this is a parent'
    it('create root node and give it a name', () => {
      createRootNodeWithName(cy, nodeName)
      expectToFindNodeInput(cy, false)
    })

    it('create a child node', () => {
      createRootNodeWithName(cy, 'parent')
      pressOnKeyboard(cy, 'c')
      expectToFindNodeInput(cy)
      expectToFindMultipleNodes(cy, 2)
    })

    it('give child node a name', () => {
      createRootNodeWithName(cy, 'parent')
      pressOnKeyboard(cy, 'c')

      typeOnKeyboard(cy, 'child')
      pressOnKeyboard(cy, 'enter')
      expectFocusedToContainText(cy, 'child')
      expectToFindNodeInput(cy, false)
    })
  })
}
