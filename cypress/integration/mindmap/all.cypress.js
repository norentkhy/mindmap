import testNodeCreation from 'src/specifications/node-creation/integration.cypress'
import testNodeFolding from 'src/specifications/node-folding/integration.cypress'
import testTabs from 'src/specifications/tabs/integration.cypress'
import testUndoRedo from 'src/specifications/undo-redo/integration.cypress'
import testNodePlacement from 'src/specifications/node-placement/integration.cypress'
import testNodeKeyboardNavigation from 'src/specifications/node-keyboard-navigation/integration.cypress'
import testNodeDragAndDrop from 'src/specifications/node-drag-and-drop/integration.cypress'
import testLinks from 'src/specifications/node-links/integration.cypress'
import testInteractiveActions from 'src/specifications/interactive-actions/integration.cypress'

testNodeKeyboardNavigation(describe, beforeEach, it, cy)

const testSpecifications = [
  ['node creation', testNodeCreation],
  ['node folding', testNodeFolding],
  ['tabs', testTabs],
  ['undo redo nodes', testUndoRedo],
  ['node placement', testNodePlacement],
  ['node keyboard navigation', testNodeKeyboardNavigation],
  ['node drag and drop', testNodeDragAndDrop],
  ['node links', testLinks],
  ['interactive actions', testInteractiveActions],
]

testSpecifications.forEach(([description, executeTests]) => {
  describe(description, () => {
    executeTests(describe, beforeEach, it, cy)
  })
})
