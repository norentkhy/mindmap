const label = {
  mindSpace: 'main view',
  node: 'node',
  editingNode: 'editing node',
  createRootNodeButton: 'create root node',
}

export function clickButtonToCreateNode(cy) {
  cy.findByLabelText(label.createRootNodeButton).click()
}

function calculateOffsetCenter(Element) {
  const { offsetWidth, offsetHeight } = Element
  const left = offsetWidth / 2
  const top = offsetHeight / 2

  return { left, top }
}

export function createRootNodeWithName(cy, name) {
  doubleClickToCreateNode(cy)
  typeOnKeyboard(cy, name)
  pressOnKeyboard(cy, 'enter')
}

function doubleClickMindSpace({ cy, provideClickOffset, offsetName }) {
  cy.findByLabelText(label.mindSpace)
    .as('MindSpace')
    .then(([MindSpace]) => ({
      MindSpace,
      offset: provideClickOffset(MindSpace),
    }))
    .then(({ MindSpace, offset }) => {
      if (offsetName) cy.wrap(offset).as(offsetName)
      cy.wrap(MindSpace).dblclick([offset.left, offset.top])
    })
}

export function doubleClickToCreateNode(cy) {
  doubleClickMindSpace({ cy, provideClickOffset: calculateOffsetCenter })
}

export function expectFocusedToContainText(cy, nodeName) {
  cy.focused().should('contain.text', nodeName)
}

export function expectToFindMultipleNodes(cy, amount) {
  cy.findAllByLabelText(label.node).should(($n) => {
    if (amount) expect($n).to.have.length(amount)
  })
}

export function expectToFindNode(cy) {
  cy.findByLabelText(label.node)
}

export function expectToFindNodeInput(cy, positive = true) {
  const NodeInput = cy.findByLabelText(label.editingNode)
  if (positive) NodeInput.should('exist')
  if (!positive) NodeInput.should('not.exist')
}

export function pressOnKeyboard(cy, button) {
  if (button == 'enter') return typeOnKeyboard(cy, '{enter}')
  return typeOnKeyboard(cy, button)
}

export function typeOnKeyboard(cy, typingContent) {
  cy.focused().type(typingContent)
}

export function visitMindmapApp(cy) {
  cy.visit('http://localhost:8080/mindmap')
}
