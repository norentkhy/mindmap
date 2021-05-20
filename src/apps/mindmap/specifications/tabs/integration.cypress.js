import { repeat } from '~/utils/FunctionalProgramming'
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
} from '~mindmap/test-utilities/cypress'

export default function testTabs(describe, beforeEach, it, cy) {
  describe('add a tab', () => {
    beforeEach(() => {
      visitMindmapApp(cy)
    })

    it('starts with untitled tab', () => {
      expectToFindText(cy, 'untitled')
    })

    it('add a new tab', () => {
      clickButtonToAddTab(cy)
      expectToFindMultipleText(cy, 2, 'untitled')
    })

    it('add multiple new tabs', () => {
      repeat(4, () => clickButtonToAddTab(cy))
      expectToFindMultipleText(cy, 5, 'untitled')
    })
  })

  describe('renaming tabs', () => {
    beforeEach(() => {
      visitMindmapApp(cy)
      repeat(5, () => clickButtonToAddTab(cy))
    })

    it('double click on tab gives rename focus', () => {
      doubleClickToRenameTabFromLeft(cy, 3)
      expectTabInputToHaveFocus(cy)
    })

    it('rename applies on the target', () => {
      doubleClickToRenameTabFromLeft(cy, 0)
      typeOnKeyboard(cy, 'this is renamed')
      pressOnKeyboard(cy, 'enter')
      expectTabFromLeftToHaveName(cy, 0, 'this is renamed')
    })
  })
}
