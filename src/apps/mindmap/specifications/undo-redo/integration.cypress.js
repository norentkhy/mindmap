import {
  clickButtonToUndoAction,
  clickButtonToRedoAction,
  doubleClickToCreateNode,
  visitMindmapApp,
  expectToFindNodeInput,
  expectNodeInputToHaveFocus,
  typeOnKeyboard,
  pressOnKeyboard,
  expectToFindText,
  createRootNodeWithName,
  createChildNodeWithName,
} from '~mindmap/test-utilities/cypress'
import { repeat } from '~/utils/FunctionalProgramming'

export default function testUndoRedo(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  describe('undo and redo', () => {
    it('simple case', () => {
      doubleClickToCreateNode(cy)

      clickButtonToUndoAction(cy)
      expectToFindNodeInput(cy, false)

      clickButtonToRedoAction(cy)
      expectNodeInputToHaveFocus(cy)

      typeOnKeyboard(cy, 'test if this will be redone')
      pressOnKeyboard(cy, 'enter')
      expectToFindNodeInput(cy, false)

      clickButtonToUndoAction(cy)
      expectNodeInputToHaveFocus(cy)

      clickButtonToRedoAction(cy)
      expectToFindText(cy, 'test if this will be redone')
    })

    it('undo and redo more than is available', () => {
      createRootNodeWithName(cy, 'has child')
      createChildNodeWithName(cy, 'has parent')
      createRootNodeWithName(cy, 'does not have child')

      repeat(10, () => clickButtonToUndoAction(cy))
      expectToFindText(cy, 'has child', false)
      expectToFindText(cy, 'has parent', false)
      expectToFindText(cy, 'does not have child', false)

      repeat(9, () => clickButtonToRedoAction(cy))
      expectToFindText(cy, 'has child')
      expectToFindText(cy, 'has parent')
      expectToFindText(cy, 'does not have child')
    })
  })
}
