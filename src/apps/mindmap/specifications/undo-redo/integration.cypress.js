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
  })
}
