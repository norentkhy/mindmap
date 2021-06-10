import testNodeCreation from '~mindmap/specifications/node-creation/integration.cypress'
import testNodeFolding from '~mindmap/specifications/node-folding/integration.cypress'
import testTabs from '~mindmap/specifications/tabs/integration.cypress'
import testUndoRedo from '~mindmap/specifications/undo-redo/integration.cypress'
import testNodePlacement from '~mindmap/specifications/node-placement/integration.cypress'
import testNodeKeyboardNavigation from '~mindmap/specifications/node-keyboard-navigation/integration.cypress'
import testNodeDragAndDrop from '~mindmap/specifications/node-drag-and-drop/integration.cypress'

testNodeKeyboardNavigation(describe, beforeEach, it, cy)

const testSpecifications = [
  ['node creation', testNodeCreation],
  ['node folding', testNodeFolding],
  ['tabs', testTabs],
  ['undo redo nodes', testUndoRedo],
  ['node placement', testNodePlacement],
  ['node keyboard navigation', testNodeKeyboardNavigation],
  ['node drag and drop', testNodeDragAndDrop],
]

testSpecifications.forEach(([description, executeTests]) => {
  describe(description, () => {
    executeTests(describe, beforeEach, it, cy)
  })
})
