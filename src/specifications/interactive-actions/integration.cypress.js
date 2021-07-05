import {
  label,
  typeAndPressEnter,
  visitMindmapApp,
} from 'src/test-utils/cypress'

export default function testInteractiveActions(describe, beforeEach, test, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  test('action panel exists', () => {
    cy.findByLabelText('interactive actions console')
  })

  test('only create node available as initial action', () => {
    usingInteractiveActionsConsole(() => {
      const expectedEnabledLabels = ['create root node']
      cy.findAllByRole('button').then((buttons) => {
        const buttonsInUnexpectedState = Array.from(buttons).filter(
          (element) =>
            (element.disabled &&
              expectedEnabledLabels.includes(element.ariaLabel)) ||
            (!element.disabled &&
              !expectedEnabledLabels.includes(element.ariaLabel))
        )
        expect(buttonsInUnexpectedState).deep.equal([])
      })
    })
  })

  test('create a child node', () => {
    usingInteractiveActionsConsole(() => {
      cy.findByLabelText(label.createRootNodeButton).click()
      typeAndPressEnter(cy, 'parent')
      cy.findByLabelText(label.createChildNodeButton).click()
    })
  })

  test('undo actions', () => {
    usingInteractiveActionsConsole(() => {
      cy.findByLabelText(label.createRootNodeButton).click()
      typeAndPressEnter(cy, 'parent')
      cy.findByLabelText(label.createChildNodeButton).click()
      cy.findByLabelText(label.undoButton).click()
    })
  })
}

function usingInteractiveActionsConsole(callback) {
  return cy.findByLabelText('interactive actions console').within(() => {
    callback()
  })
}
