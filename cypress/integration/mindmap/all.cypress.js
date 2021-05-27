import testNodeCreation from '~mindmap/specifications/node-creation/integration.cypress'
import testNodeFolding from '~mindmap/specifications/node-folding/integration.cypress'
import testTabs from '~mindmap/specifications/tabs/integration.cypress'
import testUndoRedo from '~mindmap/specifications/undo-redo/integration.cypress'
import testNodePlacement from '~mindmap/specifications/node-placement/integration.cypress'

const testSpecifications = [
  ['node creation', testNodeCreation],
  ['node folding', testNodeFolding],
  ['tabs', testTabs],
  ['undo redo nodes', testUndoRedo],
  ['node placement', testNodePlacement],
]

testSpecifications.forEach(([description, executeTests]) => {
  describe(description, () => {
    executeTests(describe, beforeEach, it, cy)
  })
})
