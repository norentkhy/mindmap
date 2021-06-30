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

export default function testNodeCreation(describe, beforeEach, test, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  describe('methods of root node creation', () => {
    ;[doubleClickToCreateNode, clickButtonToCreateNode].forEach(
      (createRootNode) => {
        test(`${createRootNode.name}`, () => {
          createRootNode(cy)

          expectToFindNode(cy)
          expectToFindNodeInput(cy)
        })
      }
    )
  })

  describe('editing a node', () => {
    const nodeName = 'this is a name'

    test('complete node naming after root node creation', () => {
      clickButtonToCreateNode(cy)

      typeOnKeyboard(cy, nodeName)
      pressOnKeyboard(cy, 'enter')

      expectFocusedToContainText(cy, nodeName)
      expectToFindNodeInput(cy, false)
    })

    test('edit a node that already has a name', () => {
      createRootNodeWithName(cy, nodeName)
      pressOnKeyboard(cy, 'enter')

      expectToFindNodeInput(cy)
      cy.focused().should('have.value', nodeName)
    })

    test('nodes can contain multiple lines', () => {
      const lines = ['this is the first line', 'this is the last line']
      clickButtonToCreateNode(cy)

      typeOnKeyboard(cy, lines[0])
      pressOnKeyboard(cy, 'enter', { shift: true })
      
      typeOnKeyboard(cy, lines[1])
      pressOnKeyboard(cy, 'enter')

      lines.forEach(line => expectFocusedToContainText(cy, line))
      expectToFindNodeInput(cy, false)
    })
  })

  describe('creating a child node', () => {
    const nodeName = 'this is a parent'
    test('create root node and give it a name', () => {
      createRootNodeWithName(cy, nodeName)
      expectToFindNodeInput(cy, false)
    })

    test('create a child node', () => {
      createRootNodeWithName(cy, 'parent')
      pressOnKeyboard(cy, 'c')
      expectToFindNodeInput(cy)
      expectToFindMultipleNodes(cy, 2)
    })

    test('give child node a name', () => {
      createRootNodeWithName(cy, 'parent')
      pressOnKeyboard(cy, 'c')

      typeOnKeyboard(cy, 'child')
      pressOnKeyboard(cy, 'enter')
      expectFocusedToContainText(cy, 'child')
      expectToFindNodeInput(cy, false)
    })
  })
}
