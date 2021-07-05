import { repeat } from 'src/utils/FunctionalProgramming'
import {
  clickButtonToAddTab,
  doubleClickToRenameTabFromLeft,
  expectToFindMultipleText,
  expectToFindText,
  visitMindmapApp,
  expectTabInputToHaveFocus,
  typeOnKeyboard,
  pressOnKeyboard,
  expectTabFromLeftToHaveName,
  createRootNodeWithName,
  clickTabFromLeft,
} from 'src/test-utils/cypress'

export default function testTabs(describe, beforeEach, test, cy) {
  describe('add a tab', () => {
    beforeEach(() => {
      visitMindmapApp(cy)
    })

    test('starts with untitled tab', () => {
      expectToFindText(cy, 'untitled')
    })

    test('add a new tab', () => {
      clickButtonToAddTab(cy)
      expectToFindMultipleText(cy, 2, 'untitled')
    })

    test('add multiple new tabs', () => {
      repeat(4, () => clickButtonToAddTab(cy))
      expectToFindMultipleText(cy, 5, 'untitled')
    })
  })

  describe('renaming tabs', () => {
    beforeEach(() => {
      visitMindmapApp(cy)
      repeat(5, () => clickButtonToAddTab(cy))
    })

    test('double click on tab gives rename focus', () => {
      doubleClickToRenameTabFromLeft(cy, 3)
      expectTabInputToHaveFocus(cy)
    })

    test('rename applies on the target', () => {
      doubleClickToRenameTabFromLeft(cy, 0)
      typeOnKeyboard(cy, 'this is renamed')
      pressOnKeyboard(cy, 'enter')
      expectTabFromLeftToHaveName(cy, 0, 'this is renamed')
    })
  })

  describe('tab content', () => {
    beforeEach(() => {
      visitMindmapApp(cy)
    })

    test('changes when new tab is created', () => {
      const textA = 'this is in the first tab'
      createRootNodeWithName(cy, textA)
      clickButtonToAddTab(cy)
      cy.findByText(textA).should('not.exist')
    })

    test('each tab own set of nodes', () => {
      const textA = 'this is in the first tab'
      createRootNodeWithName(cy, textA)
      clickButtonToAddTab(cy)

      const textB = 'this is in the second tab'
      createRootNodeWithName(cy, textB)

      clickTabFromLeft(cy, 0)
      cy.findByText(textA).should('exist')
      cy.findByText(textB).should('not.exist')

      clickTabFromLeft(cy, 1)
      cy.findByText(textA).should('not.exist')
      cy.findByText(textB).should('exist')
    })
  })
}
