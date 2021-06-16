import { v4 as uuidv4 } from 'uuid'

export const label = {
  tabsContainer: 'tabs',
  addTabButton: 'add new tab',
  renamingTab: 'renaming this tab',
  mindSpace: 'main view',
  node: 'node',
  editingNode: 'editing node',
  createRootNodeButton: 'create root node',
  undoButton: 'undo action',
  redoButton: 'redo action',
  childLine: 'child of parent',
  linkAnchor: 'anchor of link',
}

export function find(cy, targetLabel) {
  return cy.findByLabelText(label[targetLabel])
}

export function findElementWithText(cy, text) {
  return cy.findByText(text)
}

export function clickOnElementWithText(cy, text) {
  return findElementWithText(cy, text).click()
}

export function findAllLinkAnchors(cy) {
  return cy.findAllByLabelText(label.linkAnchor)
}

export function findAllChildLinks(cy) {
  return cy.findAllByLabelText(label.childLine)
}

export function expectToFindLine(cy) {
  cy.findByLabelText(label.childLine)
}

export function clickButtonToCreateNode(cy) {
  cy.findByLabelText(label.createRootNodeButton).click()
}

export function clickButtonToUndoAction(cy) {
  cy.findByLabelText(label.undoButton).click()
}

export function clickButtonToRedoAction(cy) {
  cy.findByLabelText(label.redoButton).click()
}

export function clickButtonToAddTab(cy) {
  cy.findByLabelText(label.addTabButton).click()
}

export function expectTabInputToHaveFocus(cy, positive = true) {
  const TabInput = cy.findByLabelText(label.renamingTab)
  if (positive) TabInput.should('have.focus')
  if (!positive) TabInput.should('not.have.focus')
}

export function expectTabFromLeftToHaveName(cy, index, name) {
  const Tab = _findTabFromLeft(cy, index)
  Tab.should('have.text', name)
}

function _findTabFromLeft(cy, index) {
  return cy
    .findByLabelText(label.tabsContainer)
    .findAllByRole('button')
    .eq(index)
}

export function doubleClickToRenameTabFromLeft(cy, index) {
  _findTabFromLeft(cy, index).dblclick()
}

export function calculateOffset(Element, horizontalRatio, verticalRatio) {
  const { offsetWidth, offsetHeight } = Element
  const left = offsetWidth * horizontalRatio
  const top = offsetHeight * verticalRatio
  const normalised = { left: horizontalRatio, top: verticalRatio }

  return { left, top, normalised }
}

export function createChildNodeWithName(cy, name) {
  pressOnKeyboard(cy, 'c')
  typeOnKeyboard(cy, name)
  pressOnKeyboard(cy, 'enter')
}

export function createRootNodeWithName(cy, name) {
  clickButtonToCreateNode(cy)
  typeOnKeyboard(cy, name)
  pressOnKeyboard(cy, 'enter')
}

export function getMindSpaceNormalised(cy, x, y) {
  return cy
    .findByLabelText(label.mindSpace)
    .as('MindSpace')
    .then(([MindSpace]) => ({
      MindSpace,
      offset: calculateOffset(MindSpace, x, y),
    }))
}

function doubleClickMindSpace({ cy, provideClickOffset, offsetName }) {
  return cy
    .findByLabelText(label.mindSpace)
    .as('MindSpace')
    .then(([MindSpace]) => ({
      MindSpace,
      offset: provideClickOffset(MindSpace),
    }))
    .then(({ MindSpace, offset }) => {
      if (offsetName) cy.wrap(offset).as(offsetName)
      cy.wrap(MindSpace).dblclick(offset.left, offset.top)
    })
}

export function doubleClickToCreateNode(
  cy,
  horizontalRatio = 0.5,
  verticalRatio = 0.5,
  offsetName
) {
  return doubleClickMindSpace({
    cy,
    provideClickOffset: (Element) =>
      calculateOffset(Element, horizontalRatio, verticalRatio),
    offsetName,
  })
}

export function expectFocusedToContainText(cy, nodeName) {
  cy.focused().should('contain.text', nodeName)
}

export function expectFocusedToHaveText(cy, nodeName) {
  cy.focused().should('have.text', nodeName)
}

export function expectNodeInputToHaveFocus(cy, positive = true) {
  const NodeInput = cy.findByLabelText(label.editingNode)
  if (positive) NodeInput.should('have.focus')
  if (!positive) NodeInput.should('not.have.focus')
}

export function expectToFindMultipleNodes(cy, amount) {
  cy.findAllByLabelText(label.node).should(($n) => {
    if (amount) expect($n).to.have.length(amount)
  })
}

export function expectToFindNodeAt(cy, offsetLabel) {
  cy.all(
    cy.findByLabelText(label.node),
    cy.get('@MindSpace'),
    cy.get(`@${offsetLabel}`)
  )
    .then(([[Node], [MindSpace], mouseOffset]) => ({
      Node,
      MindSpace,
      mouseOffset,
    }))
    .then(({ Node, MindSpace, mouseOffset }) => ({
      offsetNode: calculateOffsetFromMindSpace({ Element: Node, MindSpace }),
      mouseOffset,
    }))
    .should(({ offsetNode, mouseOffset }) => {
      expectTargetToSurroundPoint({ target: offsetNode, point: mouseOffset })
    })
}

export function expectToFocusedAt(cy, offsetLabel) {
  cy.all(cy.focused(), cy.get('@MindSpace'), cy.get(`@${offsetLabel}`))
    .then(([[Focused], [MindSpace], mouseOffset]) => ({
      Focused,
      MindSpace,
      mouseOffset,
    }))
    .then(({ Focused, MindSpace, mouseOffset }) => ({
      offsetNode: calculateOffsetFromMindSpace({ Element: Focused, MindSpace }),
      mouseOffset,
    }))
    .should(({ offsetNode, mouseOffset }) => {
      expectTargetToSurroundPoint({ target: offsetNode, point: mouseOffset })
    })
}

export function expectFocusedAtNormalised(cy, x, y) {
  cy.all(cy.focused(), cy.get('@MindSpace'))
    .then(([[Focused], [MindSpace]]) => ({
      Focused,
      MindSpace,
    }))
    .then(({ Focused, MindSpace }) => ({
      offsetNode: calculateOffsetFromMindSpace({ Element: Focused, MindSpace }),
      mouseOffset: calculateOffset(MindSpace, x, y),
    }))
    .should(({ offsetNode, mouseOffset }) => {
      expectTargetToSurroundPoint({ target: offsetNode, point: mouseOffset })
    })
}

export function expectToFindNode(cy, positive = true) {
  const Element = cy.findByLabelText(label.node)
  if (positive) Element.should('exist')
  if (!positive) Element.should('not.exist')
}

export function expectToFindText(cy, text, positive = true) {
  const Element = cy.findByText(text)
  if (positive) Element.should('exist')
  if (!positive) Element.should('not.exist')
}

export function expectToFindMultipleText(cy, amount, text) {
  cy.findAllByText(text).should(($n) => {
    if (amount) expect($n).to.have.length(amount)
  })
}

export function expectToFindNodeInput(cy, positive = true) {
  const NodeInput = cy.findByLabelText(label.editingNode)
  if (positive) NodeInput.should('exist')
  if (!positive) NodeInput.should('not.exist')
}

export function pressOnKeyboard(cy, button) {
  if (button == 'enter') return typeOnKeyboard(cy, '{enter}')
  if (button == 'left') return typeOnKeyboard(cy, '{leftarrow}')
  if (button == 'right') return typeOnKeyboard(cy, '{rightarrow}')
  if (button == 'up') return typeOnKeyboard(cy, '{uparrow}')
  if (button == 'down') return typeOnKeyboard(cy, '{downarrow}')
  return typeOnKeyboard(cy, button)
}

export function typeOnKeyboard(cy, typingContent) {
  cy.focused().type(typingContent)
}

export function visitMindmapApp(cy) {
  cy.visit('http://localhost:8080/mindmap')
}

function expectTargetToSurroundPoint({ target, point }) {
  expect(target.left).to.be.below(point.left)
  expect(target.left + target.width).to.be.above(point.left)
  expect(target.top).to.be.below(point.top)
  expect(target.top + target.height).to.be.above(point.top)
}

export function expectToBeSurrounded(point, rect) {
  expect(rect.left).to.be.below(point.left)
  expect(rect.left + rect.width).to.be.above(point.left)
  expect(rect.top).to.be.below(point.top)
  expect(rect.top + rect.height).to.be.above(point.top)
}

export function calculateOffsetDifference(ElementA, ElementB) {
  const RectA = ElementA.getBoundingClientRect()
  const RectB = ElementB.getBoundingClientRect()

  return {
    left: RectA.left - RectB.left,
    top: RectA.top - RectB.top,
    width: RectA.width,
    height: RectA.width,
  }
}

function calculateOffsetFromMindSpace({ Element, MindSpace }) {
  const MindSpaceRect = MindSpace.getBoundingClientRect()
  const ElementRect = Element.getBoundingClientRect()

  return {
    left: ElementRect.left - MindSpaceRect.left,
    top: ElementRect.top - MindSpaceRect.top,
    width: ElementRect.width,
    height: ElementRect.height,
  }
}

export function generateUniqueString() {
  return uuidv4()
}

/**
 * new style:
 * - more functional, no surprises
 * - makes use of .then-chains
 *   - this is how cypress guarantees order
 */

export function dragAndDropElement(cy, nodeText, startOffset, endOffset) {
  return cy
    .findByText(nodeText)
    .trigger('dragstart', {
      dataTransfer: new DataTransfer(),
      clientX: startOffset.left,
      clientY: startOffset.top,
    })
    .trigger('drop', {
      clientX: endOffset.left,
      clientY: endOffset.top,
    })
    .trigger('dragend', {
      clientX: endOffset.left,
      clientY: endOffset.top,
    })
}

export function expectFocusedAtElementNormalised(cy, Element, x, y) {
  return cy
    .focused()
    .then(([Focused]) => ({
      focusedOffset: calculateOffsetDifference(Focused, Element),
      expectedOffset: calculateOffset(Element, x, y),
    }))
    .should(({ focusedOffset, expectedOffset }) => {
      expectToBeSurrounded(expectedOffset, focusedOffset)
    })
}

export function doubleClickElement(cy, Element, offset) {
  return cy.wrap(Element).dblclick(offset.left, offset.top)
}

export function doubleClickElementNormalised(cy, Element, x, y) {
  return cy.wrap(Element).dblclick(x, y)
}

export function typeAndPressEnter(cy, text) {
  return cy.focused().type(text).type('{enter}')
}

export function expectOffsetBetween(offsetBetween, [offsetA, offsetB]) {
  if (offsetA.left < offsetBetween.left)
    return expectOffsetBetweenSorted(offsetBetween, [offsetA, offsetB])
  if (offsetB.left < offsetBetween.left)
    return expectOffsetBetweenSorted(offsetBetween, [offsetB, offsetA])
  throw new Error('offsetBetween definitely not between A and B')
}

export function expectOffsetBetweenSorted(offsetBetween, [offsetL, offsetR]) {
  expect(offsetBetween.left).to.be.gte(offsetL.left)
  expect(offsetBetween.top).to.be.gte(offsetL.top)
  expect(offsetBetween.left).to.be.lte(offsetR.left)
  expect(offsetBetween.top).to.be.lte(offsetR.top)
}
