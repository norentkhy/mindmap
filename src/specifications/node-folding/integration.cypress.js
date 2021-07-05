import {
  createRootNodeWithName,
  createChildNodeWithName,
  clickOnElementWithText,
  expectFocusedToHaveText,
  pressOnKeyboard,
  visitMindmapApp,
  expectToFindText,
} from 'src/test-utils/cypress'

export default function testNodeCreation(describe, it, cy) {
  const { nodeTexts, targetText, foldedTexts, neverFoldedTexts } =
    getNodeTexts()

  describe('prerequisites', () => {
    it('a tree of nodes can be made', () => {
      visitMindmapApp(cy)
      createTreeOfNodes(cy)

      clickOnElementWithText(cy, targetText)
      pressOnKeyboard(cy, 'f')
      foldedTexts.forEach((text) => expectToFindText(cy, text, false))
      neverFoldedTexts.forEach((text) => expectToFindText(cy, text))

      pressOnKeyboard(cy, 'f')
      nodeTexts.forEach((text) => expectToFindText(cy, text))
      /** use this once the project is on the new state data structure*/
      waitForPossibleFocusChange(cy)
      expectFocusedToHaveText(cy, targetText)
    })
  })
}

function waitForPossibleFocusChange(cy) {
  cy.wait(500)
}

function getNodeTexts() {
  const nodeTexts = [
    'A',
    'A^1',
    'A^1^1',
    'A^1^2',
    'A^2',
    'A^2^1',
    'A^2^2',
    'A^2^3',
    'A^3',
    'A^4',
  ]
  const targetText = 'A^2'
  const foldedTexts = nodeTexts.filter(
    (text) => text.includes(targetText) && text !== targetText
  )
  const neverFoldedTexts = nodeTexts.filter(
    (text) => !foldedTexts.includes(text)
  )

  return {
    nodeTexts,
    targetText,
    foldedTexts,
    neverFoldedTexts,
  }
}

function createTreeOfNodes(cy) {
  createRootNodeWithName(cy, 'A')
  createChildNodeWithName(cy, 'A^1')
  createChildNodeWithName(cy, 'A^1^1')
  createChildNodeWithName(cy, 'A^1^2')

  clickOnElementWithText(cy, 'A')
  createChildNodeWithName(cy, 'A^2')
  createChildNodeWithName(cy, 'A^2^1')
  createChildNodeWithName(cy, 'A^2^2')
  createChildNodeWithName(cy, 'A^2^3')

  clickOnElementWithText(cy, 'A')
  createChildNodeWithName(cy, 'A^3')

  clickOnElementWithText(cy, 'A')
  createChildNodeWithName(cy, 'A^4')
}
